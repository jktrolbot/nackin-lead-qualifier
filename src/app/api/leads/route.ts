import { NextRequest, NextResponse } from 'next/server';
import { getLeads, saveLead } from '@/lib/store';
import { LeadData } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const scoreFilter = searchParams.get('score');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const search = searchParams.get('search');

    let leads = getLeads();

    // Filter by score label
    if (scoreFilter && scoreFilter !== 'all') {
      leads = leads.filter(l => l.scoreLabel === scoreFilter);
    }

    // Filter by date range
    if (dateFrom) {
      const from = new Date(dateFrom);
      leads = leads.filter(l => new Date(l.createdAt || 0) >= from);
    }
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      leads = leads.filter(l => new Date(l.createdAt || 0) <= to);
    }

    // Search by name/email/company
    if (search) {
      const q = search.toLowerCase();
      leads = leads.filter(l =>
        (l.name || '').toLowerCase().includes(q) ||
        (l.email || '').toLowerCase().includes(q) ||
        (l.company || '').toLowerCase().includes(q)
      );
    }

    return NextResponse.json({ leads, total: leads.length });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Partial<LeadData>;
    const saved = saveLead(body);
    return NextResponse.json({ lead: saved }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
