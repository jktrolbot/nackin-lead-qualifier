'use client';

import { useState, useEffect, useCallback } from 'react';
import { MetricsCards } from '@/components/dashboard/MetricsCards';
import { LeadsChart } from '@/components/dashboard/LeadsChart';
import { LeadsTable } from '@/components/dashboard/LeadsTable';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DashboardMetrics, LeadData } from '@/types';
import { RefreshCw, Zap, LayoutDashboard, ExternalLink, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface MetricsResponse {
  metrics: DashboardMetrics & {
    leadsPerDay: {
      date: string;
      count: number;
      hot: number;
      warm: number;
      cold: number;
    }[];
  };
}

interface LeadsResponse {
  leads: LeadData[];
  total: number;
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<MetricsResponse['metrics'] | null>(null);
  const [leads, setLeads] = useState<LeadData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadData = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    else setIsRefreshing(true);
    setHasError(false);

    try {
      const [metricsRes, leadsRes] = await Promise.all([
        fetch('/api/metrics'),
        fetch('/api/leads'),
      ]);

      if (!metricsRes.ok || !leadsRes.ok) {
        throw new Error('API returned an error response');
      }

      const [metricsData, leadsData] = await Promise.all([
        metricsRes.json() as Promise<MetricsResponse>,
        leadsRes.json() as Promise<LeadsResponse>,
      ]);

      setMetrics(metricsData.metrics);
      setLeads(leadsData.leads);
      setLastUpdated(new Date());

      if (silent) {
        toast.success('Dashboard refreshed');
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setHasError(true);
      if (silent) {
        toast.error('Failed to refresh data');
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => loadData(true), 30_000);
    return () => clearInterval(interval);
  }, [loadData]);

  const scoreDistribution = {
    hot:         leads.filter(l => l.scoreLabel === 'hot').length,
    warm:        leads.filter(l => l.scoreLabel === 'warm').length,
    cold:        leads.filter(l => l.scoreLabel === 'cold').length,
    unqualified: leads.filter(l => l.scoreLabel === 'unqualified' || !l.scoreLabel).length,
  };

  // ── Loading skeleton ──────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────
  if (hasError && !metrics) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <h2 className="text-lg font-semibold mb-2">Failed to load dashboard</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Could not reach the API. Make sure the server is running or try again.
          </p>
          <Button onClick={() => loadData()} className="bg-indigo-600 hover:bg-indigo-700">
            Try again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top nav */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-sm">LeadQualifier</span>
            <Badge variant="outline" className="text-xs ml-1">Admin</Badge>
          </div>
          <div className="flex items-center gap-2">
            {lastUpdated && (
              <span className="text-xs text-muted-foreground hidden sm:block">
                Updated {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => loadData(true)}
              disabled={isRefreshing}
              className="h-8 gap-1.5 text-xs"
            >
              <RefreshCw className={cn('w-3.5 h-3.5', isRefreshing && 'animate-spin')} />
              Refresh
            </Button>
            <Link href="/" target="_blank">
              <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                <ExternalLink className="w-3.5 h-3.5" />
                Live Demo
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Page title */}
        <div className="flex items-center gap-2">
          <LayoutDashboard className="w-5 h-5 text-muted-foreground" />
          <h1 className="text-lg font-semibold">Lead Dashboard</h1>
          <Badge className="bg-indigo-600 text-white ml-2">{leads.length} total</Badge>
        </div>

        {/* Metrics cards */}
        {metrics && <MetricsCards metrics={metrics} />}

        {/* Charts */}
        {metrics && (
          <LeadsChart data={metrics.leadsPerDay} scoreDistribution={scoreDistribution} />
        )}

        {/* Leads table */}
        <div>
          <h2 className="text-sm font-semibold mb-3">All Leads</h2>
          <LeadsTable leads={leads} onRefresh={() => loadData(true)} />
        </div>
      </main>
    </div>
  );
}
