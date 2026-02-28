import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MetricsCards } from '@/components/dashboard/MetricsCards';
import type { DashboardMetrics } from '@/types';

const mockMetrics: DashboardMetrics = {
  totalLeads: 42,
  hotLeads: 12,
  warmLeads: 15,
  coldLeads: 10,
  conversionRate: 64,
  averageScore: 58,
  leadsPerDay: [],
};

describe('MetricsCards', () => {
  it('renders all four metric cards', () => {
    render(<MetricsCards metrics={mockMetrics} />);
    expect(screen.getByText('Total Leads')).toBeInTheDocument();
    expect(screen.getByText(/Hot Leads/)).toBeInTheDocument();
    expect(screen.getByText('Conversion Rate')).toBeInTheDocument();
    expect(screen.getByText('Avg Score')).toBeInTheDocument();
  });

  it('displays the total leads count', () => {
    render(<MetricsCards metrics={mockMetrics} />);
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('displays the hot leads count', () => {
    render(<MetricsCards metrics={mockMetrics} />);
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('displays conversion rate with percent sign', () => {
    render(<MetricsCards metrics={mockMetrics} />);
    expect(screen.getByText('64%')).toBeInTheDocument();
  });

  it('displays average score', () => {
    render(<MetricsCards metrics={mockMetrics} />);
    expect(screen.getByText('58')).toBeInTheDocument();
  });

  it('shows "Excellent" badge when avg score >= 70', () => {
    render(<MetricsCards metrics={{ ...mockMetrics, averageScore: 75 }} />);
    expect(screen.getByText('Excellent')).toBeInTheDocument();
  });

  it('shows "Good" badge when avg score is 40–69', () => {
    render(<MetricsCards metrics={{ ...mockMetrics, averageScore: 50 }} />);
    expect(screen.getByText('Good')).toBeInTheDocument();
  });

  it('shows "Needs work" badge when avg score < 40', () => {
    render(<MetricsCards metrics={{ ...mockMetrics, averageScore: 25 }} />);
    expect(screen.getByText('Needs work')).toBeInTheDocument();
  });

  it('shows 0% hot rate when totalLeads is 0', () => {
    render(<MetricsCards metrics={{ ...mockMetrics, totalLeads: 0, hotLeads: 0 }} />);
    expect(screen.getByText('0% of total')).toBeInTheDocument();
  });

  it('shows qualified count in Total Leads change text', () => {
    render(<MetricsCards metrics={mockMetrics} />);
    // 12 hot + 15 warm = 27 qualified
    expect(screen.getByText('27 qualified')).toBeInTheDocument();
  });
});
