import { LeadData, LeadScore } from '@/types';

interface ScoringResult {
  score: number;
  label: LeadScore;
  reasons: string[];
}

const BUDGET_KEYWORDS = {
  hot: ['10000', '15000', '20000', '25000', '30000', '40000', '50000', '100000', '10k', '15k', '20k', '25k', '30k', '50k', '100k', '$10', '$15', '$20', '$25', '$30', '$50', '$100'],
  warm: ['3000', '4000', '5000', '6000', '7000', '8000', '9000', '3k', '4k', '5k', '6k', '7k', '8k', '9k', '$3', '$4', '$5', '$6', '$7', '$8', '$9'],
  cold: ['500', '1000', '2000', '1k', '2k', '$500', '$1', '$2'],
};

const URGENCY_KEYWORDS = ['asap', 'urgent', 'immediately', 'this week', 'this month', 'soon', 'quickly', 'fast', 'now', 'today'];

export function scoreLead(lead: Partial<LeadData>): ScoringResult {
  let score = 0;
  const reasons: string[] = [];

  // Email provided (+20)
  if (lead.email && lead.email.includes('@')) {
    score += 20;
    reasons.push('Contact email provided (+20)');
  }

  // Name provided (+10)
  if (lead.name && lead.name.length > 1) {
    score += 10;
    reasons.push('Name provided (+10)');
  }

  // Company provided (+15)
  if (lead.company && lead.company.length > 1) {
    score += 15;
    reasons.push('Company identified (+15)');
  }

  // Need/project description (+10)
  if (lead.need && lead.need.length > 20) {
    score += 10;
    reasons.push('Clear project need (+10)');
  }

  // Budget scoring
  if (lead.budget) {
    const budgetLower = lead.budget.toLowerCase();
    
    if (BUDGET_KEYWORDS.hot.some(k => budgetLower.includes(k))) {
      score += 45;
      reasons.push('High budget ($10k+) (+45)');
    } else if (BUDGET_KEYWORDS.warm.some(k => budgetLower.includes(k))) {
      score += 25;
      reasons.push('Medium budget ($3k-$9k) (+25)');
    } else if (BUDGET_KEYWORDS.cold.some(k => budgetLower.includes(k))) {
      score += 5;
      reasons.push('Low budget (<$3k) (+5)');
    } else {
      // Has budget but unrecognized
      score += 15;
      reasons.push('Budget mentioned (+15)');
    }
  }

  // Urgency check in need or budget
  const fullText = `${lead.need || ''} ${lead.budget || ''}`.toLowerCase();
  if (URGENCY_KEYWORDS.some(k => fullText.includes(k))) {
    score += 10;
    reasons.push('Urgency detected (+10)');
  }

  // Normalize to 0-100
  score = Math.min(100, Math.max(0, score));

  // Determine label
  let label: LeadScore;
  if (score >= 70) {
    label = 'hot';
  } else if (score >= 40) {
    label = 'warm';
  } else if (score >= 10) {
    label = 'cold';
  } else {
    label = 'unqualified';
  }

  return { score, label, reasons };
}

export function getScoreColor(label: LeadScore): string {
  switch (label) {
    case 'hot': return 'text-red-500';
    case 'warm': return 'text-orange-500';
    case 'cold': return 'text-blue-500';
    default: return 'text-gray-500';
  }
}

export function getScoreBadgeVariant(label: LeadScore): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (label) {
    case 'hot': return 'destructive';
    case 'warm': return 'default';
    case 'cold': return 'secondary';
    default: return 'outline';
  }
}

export function getScoreEmoji(label: LeadScore): string {
  switch (label) {
    case 'hot': return '🔥';
    case 'warm': return '⚡';
    case 'cold': return '❄️';
    default: return '👤';
  }
}
