import { describe, it, expect } from 'vitest';
import {
  scoreLead,
  getScoreColor,
  getScoreBadgeVariant,
  getScoreEmoji,
} from '@/lib/scoring';

describe('scoreLead', () => {
  it('returns score 0 and label unqualified for empty lead', () => {
    const result = scoreLead({});
    expect(result.score).toBe(0);
    expect(result.label).toBe('unqualified');
    expect(result.reasons).toHaveLength(0);
  });

  it('awards +20 for a valid email', () => {
    const result = scoreLead({ email: 'test@example.com' });
    expect(result.score).toBe(20);
    expect(result.reasons).toContain('Contact email provided (+20)');
  });

  it('does not award points for email without @', () => {
    const result = scoreLead({ email: 'notanemail' });
    expect(result.score).toBe(0);
  });

  it('awards +10 for a name longer than 1 char', () => {
    const result = scoreLead({ name: 'Alice' });
    expect(result.score).toBe(10);
    expect(result.reasons).toContain('Name provided (+10)');
  });

  it('awards +15 for company', () => {
    const result = scoreLead({ company: 'Acme Corp' });
    expect(result.score).toBe(15);
    expect(result.reasons).toContain('Company identified (+15)');
  });

  it('awards +10 for need description > 20 chars', () => {
    const result = scoreLead({ need: 'Build a SaaS analytics dashboard with charts' });
    expect(result.score).toBe(10);
    expect(result.reasons).toContain('Clear project need (+10)');
  });

  it('does NOT award points for need <= 20 chars', () => {
    const result = scoreLead({ need: 'Short need' });
    expect(result.score).toBe(0);
  });

  // Budget scoring tests (core bug fix verification)
  it('awards +45 for high budget $15,000', () => {
    const result = scoreLead({ budget: '$15,000' });
    expect(result.reasons).toContain('High budget ($10k+) (+45)');
    expect(result.score).toBe(45);
  });

  it('awards +45 for high budget 25k', () => {
    const result = scoreLead({ budget: '25k' });
    expect(result.reasons).toContain('High budget ($10k+) (+45)');
  });

  it('awards +45 for high budget $90,000 (was a false-positive bug)', () => {
    const result = scoreLead({ budget: '$90,000' });
    expect(result.reasons).toContain('High budget ($10k+) (+45)');
    expect(result.label).toBe('warm'); // score = 45 (no other fields)
  });

  it('awards +45 for high budget $50k', () => {
    const result = scoreLead({ budget: '$50k' });
    expect(result.reasons).toContain('High budget ($10k+) (+45)');
  });

  it('awards +25 for medium budget $5,000', () => {
    const result = scoreLead({ budget: '$5,000' });
    expect(result.reasons).toContain('Medium budget ($3k–$9k) (+25)');
  });

  it('awards +25 for medium budget 7k', () => {
    const result = scoreLead({ budget: '7k' });
    expect(result.reasons).toContain('Medium budget ($3k–$9k) (+25)');
  });

  it('awards +5 for low budget $500', () => {
    const result = scoreLead({ budget: '$500' });
    expect(result.reasons).toContain('Low budget (<$3k) (+5)');
  });

  it('awards +10 for urgency in need', () => {
    const result = scoreLead({ need: 'We need this asap, very urgent project for us' });
    expect(result.reasons).toContain('Urgency detected (+10)');
  });

  it('classifies score >= 70 as hot', () => {
    // email+name+company+need+high budget = 20+10+15+10+45 = 100
    const result = scoreLead({
      email: 'ceo@bigco.com',
      name: 'John Doe',
      company: 'Big Corp',
      need: 'Enterprise CRM integration with Salesforce and custom APIs',
      budget: '$50,000',
    });
    expect(result.label).toBe('hot');
    expect(result.score).toBeGreaterThanOrEqual(70);
  });

  it('classifies score 40–69 as warm', () => {
    const result = scoreLead({
      email: 'user@test.com',
      name: 'Jane',
      budget: '$5,000',
    });
    // 20+10+25 = 55
    expect(result.label).toBe('warm');
  });

  it('classifies score 10–39 as cold', () => {
    const result = scoreLead({ email: 'user@test.com' });
    // 20
    expect(result.label).toBe('cold');
  });

  it('caps score at 100', () => {
    const result = scoreLead({
      email: 'ceo@bigco.com',
      name: 'John Doe',
      company: 'Big Corp',
      need: 'Enterprise CRM integration with Salesforce urgently needed',
      budget: '$100,000',
    });
    expect(result.score).toBeLessThanOrEqual(100);
  });
});

describe('getScoreColor', () => {
  it('returns red for hot', () => expect(getScoreColor('hot')).toBe('text-red-500'));
  it('returns orange for warm', () => expect(getScoreColor('warm')).toBe('text-orange-500'));
  it('returns blue for cold', () => expect(getScoreColor('cold')).toBe('text-blue-500'));
  it('returns gray for unqualified', () => expect(getScoreColor('unqualified')).toBe('text-gray-500'));
});

describe('getScoreBadgeVariant', () => {
  it('returns destructive for hot', () => expect(getScoreBadgeVariant('hot')).toBe('destructive'));
  it('returns default for warm', () => expect(getScoreBadgeVariant('warm')).toBe('default'));
  it('returns secondary for cold', () => expect(getScoreBadgeVariant('cold')).toBe('secondary'));
  it('returns outline for unqualified', () => expect(getScoreBadgeVariant('unqualified')).toBe('outline'));
});

describe('getScoreEmoji', () => {
  it('returns 🔥 for hot', () => expect(getScoreEmoji('hot')).toBe('🔥'));
  it('returns ⚡ for warm', () => expect(getScoreEmoji('warm')).toBe('⚡'));
  it('returns ❄️ for cold', () => expect(getScoreEmoji('cold')).toBe('❄️'));
  it('returns 👤 for unqualified', () => expect(getScoreEmoji('unqualified')).toBe('👤'));
});
