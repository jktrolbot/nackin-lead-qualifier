import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { ChatMessage, LeadData } from '@/types';
import { scoreLead } from '@/lib/scoring';
import { saveLead } from '@/lib/store';

// Lazy-init to avoid build-time instantiation (env vars not available at build)
let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!_openai) {
    _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _openai;
}

const SYSTEM_PROMPT = `You are a friendly and professional lead qualification assistant for a web development agency. Your goal is to have a natural conversation with potential clients to understand their needs.

IMPORTANT INSTRUCTIONS:
1. Be conversational, warm, and professional
2. Gradually gather: name, email, company/business, project need/description, budget
3. Don't ask all questions at once - have a natural conversation
4. Extract information naturally from what they say
5. After gathering key information, provide a brief summary and next steps
6. Always be helpful and enthusiastic about their project

EXTRACTION FORMAT - After each response, include a JSON block at the very end wrapped in <<<LEAD_DATA>>> tags:
<<<LEAD_DATA>>>
{
  "name": "extracted name or null",
  "email": "extracted email or null",
  "company": "extracted company/business or null",
  "need": "extracted project need or null",
  "budget": "extracted budget or null",
  "complete": false
}
<<<END_LEAD_DATA>>>

Set "complete": true only when you have gathered at minimum: email + project need + some budget indication, and you've given them next steps.

Start by greeting warmly and asking what they're looking to build.`;

export async function POST(req: NextRequest) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { messages, sessionId: _sessionId, existingLead } = await req.json() as {
      messages: ChatMessage[];
      sessionId: string;
      existingLead?: Partial<LeadData>;
    };

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages' }, { status: 400 });
    }

    // Guard against message flooding (cost / DoS protection)
    if (messages.length > 50) {
      return NextResponse.json({ error: 'Too many messages in session' }, { status: 400 });
    }

    const openaiMessages = [
      { role: 'system' as const, content: SYSTEM_PROMPT },
      ...messages.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })).filter(m => m.role === 'user' || m.role === 'assistant'),
    ];

    const completion = await getOpenAI().chat.completions.create({
      model: 'gpt-4o',
      messages: openaiMessages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const rawContent = completion.choices[0]?.message?.content || '';

    // Sanitize existingLead: only accept user-facing fields from the client.
    // Never trust score, scoreLabel, notified, or id from the client body —
    // those are computed server-side to prevent score manipulation.
    const sanitizedExisting: Partial<LeadData> = {};
    if (existingLead) {
      if (existingLead.name)    sanitizedExisting.name    = String(existingLead.name).slice(0, 200);
      if (existingLead.email)   sanitizedExisting.email   = String(existingLead.email).slice(0, 254);
      if (existingLead.company) sanitizedExisting.company = String(existingLead.company).slice(0, 200);
      if (existingLead.need)    sanitizedExisting.need    = String(existingLead.need).slice(0, 1000);
      if (existingLead.budget)  sanitizedExisting.budget  = String(existingLead.budget).slice(0, 100);
    }

    // Extract lead data from response
    const leadData: Partial<LeadData> = { ...sanitizedExisting };
    let isComplete = false;
    
    const leadDataMatch = rawContent.match(/<<<LEAD_DATA>>>([\s\S]*?)<<<END_LEAD_DATA>>>/);
    if (leadDataMatch) {
      try {
        const extracted = JSON.parse(leadDataMatch[1].trim());
        // Merge with existing, only update non-null values
        if (extracted.name) leadData.name = extracted.name;
        if (extracted.email) leadData.email = extracted.email;
        if (extracted.company) leadData.company = extracted.company;
        if (extracted.need) leadData.need = extracted.need;
        if (extracted.budget) leadData.budget = extracted.budget;
        isComplete = extracted.complete === true;
      } catch {
        // JSON parse failed, continue without extracted data
      }
    }

    // Clean response (remove the JSON block from user-visible content)
    const cleanContent = rawContent
      .replace(/<<<LEAD_DATA>>>[\s\S]*?<<<END_LEAD_DATA>>>/g, '')
      .trim();

    // If conversation complete, score and save lead
    if (isComplete && leadData.email) {
      const scoring = scoreLead(leadData);
      const savedLead = saveLead({
        ...leadData,
        score: scoring.score,
        scoreLabel: scoring.label,
        transcript: messages,
        notified: false,
      });

      // Trigger hot lead notification
      if (scoring.label === 'hot') {
        await notifyHotLead(savedLead).catch(console.error);
      }

      return NextResponse.json({
        content: cleanContent,
        leadData,
        scoring,
        leadId: savedLead.id,
        complete: true,
      });
    }

    return NextResponse.json({
      content: cleanContent,
      leadData,
      complete: false,
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat', details: String(error) },
      { status: 500 }
    );
  }
}

async function notifyHotLead(lead: LeadData) {
  const webhookUrl = process.env.WEBHOOK_URL;
  if (!webhookUrl || webhookUrl.includes('example.com')) {
    // Hot lead detected - webhook notification skipped in demo mode
    return;
  }

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event: 'hot_lead',
      lead: {
        name: lead.name,
        email: lead.email,
        company: lead.company,
        need: lead.need,
        budget: lead.budget,
        score: lead.score,
      },
      timestamp: new Date().toISOString(),
    }),
  });
}
