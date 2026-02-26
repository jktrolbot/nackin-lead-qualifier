import { NextResponse } from 'next/server';
import { getLeads } from '@/lib/store';
import { DashboardMetrics } from '@/types';

export async function GET() {
  try {
    const leads = getLeads();
    
    const hot = leads.filter(l => l.scoreLabel === 'hot').length;
    const warm = leads.filter(l => l.scoreLabel === 'warm').length;
    const cold = leads.filter(l => l.scoreLabel === 'cold').length;
    const total = leads.length;
    
    const qualifiedLeads = hot + warm;
    const conversionRate = total > 0 ? Math.round((qualifiedLeads / total) * 100) : 0;
    
    const totalScore = leads.reduce((sum, l) => sum + (l.score || 0), 0);
    const averageScore = total > 0 ? Math.round(totalScore / total) : 0;
    
    // Leads per day (last 14 days)
    const leadsPerDay: { date: string; count: number; hot: number; warm: number; cold: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayLeads = leads.filter(l => {
        const leadDate = new Date(l.createdAt || 0).toISOString().split('T')[0];
        return leadDate === dateStr;
      });
      
      leadsPerDay.push({
        date: dateStr,
        count: dayLeads.length,
        hot: dayLeads.filter(l => l.scoreLabel === 'hot').length,
        warm: dayLeads.filter(l => l.scoreLabel === 'warm').length,
        cold: dayLeads.filter(l => l.scoreLabel === 'cold').length,
      });
    }
    
    const metrics: DashboardMetrics & { leadsPerDay: typeof leadsPerDay } = {
      totalLeads: total,
      hotLeads: hot,
      warmLeads: warm,
      coldLeads: cold,
      conversionRate,
      averageScore,
      leadsPerDay,
    };
    
    return NextResponse.json({ metrics });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
