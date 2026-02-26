'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { format } from 'date-fns';

interface LeadsChartProps {
  data: {
    date: string;
    count: number;
    hot: number;
    warm: number;
    cold: number;
  }[];
  scoreDistribution: {
    hot: number;
    warm: number;
    cold: number;
    unqualified: number;
  };
}

const PIE_COLORS = {
  hot: '#ef4444',
  warm: '#f97316',
  cold: '#3b82f6',
  unqualified: '#6b7280',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
        <p className="text-xs font-medium text-muted-foreground mb-1">
          {label ? format(new Date(label), 'MMM dd, yyyy') : ''}
        </p>
        {payload.map((p: { name: string; value: number; color: string }) => (
          <div key={p.name} className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
            <span className="capitalize text-muted-foreground">{p.name}:</span>
            <span className="font-semibold">{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function LeadsChart({ data, scoreDistribution }: LeadsChartProps) {
  const pieData = [
    { name: '🔥 Hot', value: scoreDistribution.hot, color: PIE_COLORS.hot },
    { name: '⚡ Warm', value: scoreDistribution.warm, color: PIE_COLORS.warm },
    { name: '❄️ Cold', value: scoreDistribution.cold, color: PIE_COLORS.cold },
    { name: '👤 Unqualified', value: scoreDistribution.unqualified, color: PIE_COLORS.unqualified },
  ].filter(d => d.value > 0);

  const chartData = data.map(d => ({
    ...d,
    date: format(new Date(d.date), 'MMM dd'),
    fullDate: d.date,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Area chart */}
      <Card className="lg:col-span-2 border-border/50">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Leads Over Time</CardTitle>
          <CardDescription className="text-xs">Last 14 days by score</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorHot" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorWarm" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCold" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconSize={8}
                wrapperStyle={{ fontSize: '11px' }}
              />
              <Area type="monotone" dataKey="hot" name="Hot" stroke="#ef4444" fill="url(#colorHot)" strokeWidth={2} />
              <Area type="monotone" dataKey="warm" name="Warm" stroke="#f97316" fill="url(#colorWarm)" strokeWidth={2} />
              <Area type="monotone" dataKey="cold" name="Cold" stroke="#3b82f6" fill="url(#colorCold)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Pie chart */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Score Distribution</CardTitle>
          <CardDescription className="text-xs">All leads breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={(value: any, name: any) => [value ?? 0, name ?? '']}
                    contentStyle={{
                      fontSize: '11px',
                      background: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {pieData.map(item => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-[180px] flex items-center justify-center text-muted-foreground text-sm">
              No data yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
