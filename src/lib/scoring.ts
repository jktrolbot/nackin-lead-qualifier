import { LeadData, LeadScore } from '@/types';

interface ScoringResult {
  score: number;
  label: LeadScore;
  reasons: string[];
}

/** Extract a numeric dollar amount from a budget string. Returns NaN if none found. */
function parseBudgetAmount(budget: string): number {
  const lower = budget.toLowerCase().replace(/,/g, '');

  // Match patterns like "$25k", "25k", "$25,000", "25000", "$25 000"
  const kMatch = lower.match(/\$?\s*(\d+(?:\.\d+)?)\s*k/);
  if (kMatch) {
    return parseFloat(kMatch[1]) * 1000;
  }

  const plainMatch = lower.match(/\$?\s*(\d{4,})/);
  if (plainMatch) {
    return parseFloat(plainMatch[1]);
  }

  // Small amounts like "$500", "$200"
  const smallMatch = lower.match(/\$\s*(\d{1,3})(?!\d)/);
  if (smallMatch) {
    return parseFloat(smallMatch[1]);
  }

  return NaN;
}

const URGENCY_KEYWORDS = [
  'asap', 'urgent', 'immediately', 'this week', 'this month',
  'soon', 'quickly', 'fast', 'now', 'today',
];

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

  // Budget scoring — parse numeric value for accurate range comparison
  if (lead.budget) {
    const amount = parseBudgetAmount(lead.budget);

    if (!isNaN(amount)) {
      if (amount >= 10000) {
        score += 45;
        reasons.push('High budget ($10k+) (+45)');
      } else if (amount >= 3000) {
        score += 25;
        reasons.push('Medium budget ($3k–$9k) (+25)');
      } else if (amount >= 100) {
        score += 5;
        reasons.push('Low budget (<$3k) (+5)');
      } else {
        score += 15;
        reasons.push('Budget mentioned (+15)');
      }
    } else {
      // Has budget text but could not parse amount
      score += 15;
      reasons.push('Budget mentioned (+15)');
    }
  }

  // Urgency check in need or budget
  const fullText = `${lead.need ?? ''} ${lead.budget ?? ''}`.toLowerCase();
  if (URGENCY_KEYWORDS.some(k => fullText.includes(k))) {
    score += 10;
    reasons.push('Urgency detected (+10)');
  }

  // Normalize to 0–100
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
    case 'hot':  return 'text-red-500';
    case 'warm': return 'text-orange-500';
    case 'cold': return 'text-blue-500';
    default:     return 'text-gray-500';
  }
}

export function getScoreBadgeVariant(
  label: LeadScore,
): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (label) {
    case 'hot':  return 'destructive';
    case 'warm': return 'default';
    case 'cold': return 'secondary';
    default:     return 'outline';
  }
}

export function getScoreEmoji(label: LeadScore): string {
  switch (label) {
    case 'hot':  return '🔥';
    case 'warm': return '⚡';
    case 'cold': return '❄️';
    default:     return '👤';
  }
}
