'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardMetrics } from '@/types';
import { Users, Flame, TrendingUp, Star, ArrowUpRight } from 'lucide-react';

interface MetricsCardsProps {
  metrics: DashboardMetrics;
}

export function MetricsCards({ metrics }: MetricsCardsProps) {
  const cards = [
    {
      title: 'Total Leads',
      value: metrics.totalLeads,
      description: 'All time',
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      change: '+12%',
    },
    {
      title: 'Hot Leads 🔥',
      value: metrics.hotLeads,
      description: 'High-value prospects',
      icon: Flame,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      change: `${metrics.totalLeads > 0 ? Math.round((metrics.hotLeads / metrics.totalLeads) * 100) : 0}% of total`,
    },
    {
      title: 'Conversion Rate',
      value: `${metrics.conversionRate}%`,
      description: 'Hot + Warm leads',
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      change: 'warm + hot',
    },
    {
      title: 'Avg Score',
      value: metrics.averageScore,
      description: 'Out of 100',
      icon: Star,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      change: metrics.averageScore >= 70 ? 'Excellent' : metrics.averageScore >= 40 ? 'Good' : 'Needs work',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.title} className="border-border/50 hover:border-border transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3 text-green-500" />
              <p className="text-xs text-muted-foreground">{card.change}</p>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
