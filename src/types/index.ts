export type LeadScore = 'hot' | 'warm' | 'cold' | 'unqualified';

export interface LeadData {
  id?: string;
  name?: string;
  email?: string;
  company?: string;
  need?: string;
  budget?: string;
  score?: number;
  scoreLabel?: LeadScore;
  transcript?: ChatMessage[];
  createdAt?: string;
  notified?: boolean;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

export interface LeadScoringCriteria {
  hasEmail: number;
  hasCompany: number;
  hasBudget: number;
  budgetThresholds: {
    hot: number;
    warm: number;
  };
  hasUrgency: boolean;
}

export interface DashboardMetrics {
  totalLeads: number;
  hotLeads: number;
  warmLeads: number;
  coldLeads: number;
  conversionRate: number;
  averageScore: number;
  leadsPerDay: { date: string; count: number }[];
}
