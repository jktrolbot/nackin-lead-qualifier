import { describe, it, expect, beforeEach } from 'vitest';
import { getLeads, getLead, saveLead, deleteLead } from '@/lib/store';

// The store has demo data. We work around it by using unique IDs.
describe('store', () => {
  const uniqueId = `test-${Date.now()}`;

  beforeEach(() => {
    // Clean up any test leads from previous runs
    deleteLead(uniqueId);
    deleteLead(`${uniqueId}-2`);
  });

  it('getLeads returns an array', () => {
    const leads = getLeads();
    expect(Array.isArray(leads)).toBe(true);
  });

  it('getLeads returns leads sorted newest first', () => {
    const leads = getLeads();
    for (let i = 0; i < leads.length - 1; i++) {
      const a = new Date(leads[i].createdAt ?? 0).getTime();
      const b = new Date(leads[i + 1].createdAt ?? 0).getTime();
      expect(a).toBeGreaterThanOrEqual(b);
    }
  });

  it('saveLead inserts a new lead and getLead retrieves it', () => {
    saveLead({
      id: uniqueId,
      name: 'Test User',
      email: 'test@example.com',
      score: 55,
      scoreLabel: 'warm',
    });

    const lead = getLead(uniqueId);
    expect(lead).toBeDefined();
    expect(lead?.name).toBe('Test User');
    expect(lead?.email).toBe('test@example.com');
  });

  it('saveLead updates an existing lead', () => {
    saveLead({ id: uniqueId, name: 'Original', email: 'orig@test.com', score: 10 });
    saveLead({ id: uniqueId, name: 'Updated', email: 'orig@test.com', score: 80 });

    const lead = getLead(uniqueId);
    expect(lead?.name).toBe('Updated');
    expect(lead?.score).toBe(80);
  });

  it('saveLead auto-generates an id if not provided', () => {
    const saved = saveLead({ name: 'Auto ID', email: 'auto@test.com' });
    expect(saved.id).toBeTruthy();
    expect(typeof saved.id).toBe('string');
    // Clean up
    deleteLead(saved.id!);
  });

  it('saveLead sets createdAt if not provided', () => {
    const saved = saveLead({ id: uniqueId, name: 'Timestamped' });
    expect(saved.createdAt).toBeTruthy();
    expect(() => new Date(saved.createdAt!)).not.toThrow();
    deleteLead(uniqueId);
  });

  it('getLead returns undefined for a non-existent id', () => {
    const result = getLead('does-not-exist-xyz');
    expect(result).toBeUndefined();
  });

  it('deleteLead removes the lead and returns true', () => {
    saveLead({ id: uniqueId, name: 'To Delete' });
    const result = deleteLead(uniqueId);
    expect(result).toBe(true);
    expect(getLead(uniqueId)).toBeUndefined();
  });

  it('deleteLead returns false for a non-existent id', () => {
    const result = deleteLead('ghost-id-xyz');
    expect(result).toBe(false);
  });

  it('getLeads includes the saved lead', () => {
    saveLead({ id: uniqueId, name: 'Findable', email: 'findable@test.com' });
    const leads = getLeads();
    const found = leads.find(l => l.id === uniqueId);
    expect(found).toBeDefined();
    deleteLead(uniqueId);
  });
});
