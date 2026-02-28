/**
 * In-memory store for demo purposes when Supabase is not configured.
 * In production, all data goes to Supabase.
 */
import { LeadData } from '@/types';

// Global in-memory store (persists per server instance)
const memoryStore: LeadData[] = [
  {
    id: 'demo-1',
    name: 'Sarah Johnson',
    email: 'sarah@techstartup.com',
    company: 'TechStartup Inc',
    need: 'Build a SaaS dashboard with real-time analytics',
    budget: '$15,000',
    score: 85,
    scoreLabel: 'hot',
    notified: true,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    transcript: [
      { role: 'assistant', content: 'Hi! What are you looking to build?' },
      { role: 'user', content: 'We need a real-time analytics dashboard for our SaaS product.' },
      { role: 'assistant', content: 'Sounds great! What\'s your budget range?' },
      { role: 'user', content: 'We have around $15,000 allocated.' },
    ],
  },
  {
    id: 'demo-2',
    name: 'Mike Chen',
    email: 'mike@agency.io',
    company: 'Agency.io',
    need: 'E-commerce redesign with checkout optimization',
    budget: '$5,000',
    score: 55,
    scoreLabel: 'warm',
    notified: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    transcript: [
      { role: 'assistant', content: 'Hello! What project can I help with?' },
      { role: 'user', content: 'Need to redesign our e-commerce site.' },
    ],
  },
  {
    id: 'demo-3',
    name: 'Emma Wilson',
    email: 'emma@local.com',
    company: 'Local Coffee Shop',
    need: 'Simple website',
    budget: '$500',
    score: 20,
    scoreLabel: 'cold',
    notified: false,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    transcript: [
      { role: 'assistant', content: 'Hi! What are you looking for?' },
      { role: 'user', content: 'Just a basic site for my coffee shop.' },
    ],
  },
  {
    id: 'demo-4',
    name: 'Alex Rivera',
    email: 'alex@enterprise.com',
    company: 'Enterprise Corp',
    need: 'Custom CRM integration with Salesforce',
    budget: '$50,000',
    score: 95,
    scoreLabel: 'hot',
    notified: true,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    transcript: [
      { role: 'assistant', content: 'Hello! What are you building?' },
      { role: 'user', content: 'We need a custom CRM integration with Salesforce. Budget is $50k.' },
    ],
  },
  {
    id: 'demo-5',
    name: 'Jordan Lee',
    email: 'jordan@fintech.co',
    company: 'FinTech Solutions',
    need: 'Mobile banking app MVP',
    budget: '$25,000',
    score: 80,
    scoreLabel: 'hot',
    notified: false,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    transcript: [
      { role: 'assistant', content: 'Hi there! What can we help you build?' },
      { role: 'user', content: 'Looking to build a fintech mobile app, around $25k budget.' },
    ],
  },
];

export function getLeads(): LeadData[] {
  return [...memoryStore].sort((a, b) => 
    new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  );
}

export function getLead(id: string): LeadData | undefined {
  return memoryStore.find(l => l.id === id);
}

export function saveLead(lead: LeadData): LeadData {
  const newLead: LeadData = {
    ...lead,
    id: lead.id || `lead-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
    createdAt: lead.createdAt || new Date().toISOString(),
  };
  
  const idx = memoryStore.findIndex(l => l.id === newLead.id);
  if (idx >= 0) {
    memoryStore[idx] = newLead;
  } else {
    memoryStore.push(newLead);
  }
  
  return newLead;
}

export function deleteLead(id: string): boolean {
  const idx = memoryStore.findIndex(l => l.id === id);
  if (idx >= 0) {
    memoryStore.splice(idx, 1);
    return true;
  }
  return false;
}
