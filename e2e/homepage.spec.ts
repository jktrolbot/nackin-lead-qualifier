import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('loads and shows hero headline', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Qualify leads');
  });

  test('navigation bar is visible with correct links', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('navigation')).toBeVisible();
    await expect(page.getByRole('link', { name: /Dashboard/i }).first()).toBeVisible();
  });

  test('features section renders all 4 cards', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Conversational AI')).toBeVisible();
    await expect(page.getByText('Instant Lead Scoring')).toBeVisible();
    await expect(page.getByText('Analytics Dashboard')).toBeVisible();
    await expect(page.getByText('Privacy First')).toBeVisible();
  });

  test('chat bubble button is visible on page load', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: /Open chat/i })).toBeVisible();
  });

  test('clicking chat button opens the chat window', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Open chat/i }).click();
    await expect(page.getByText('Project Assistant')).toBeVisible();
  });

  test('tech stack section renders badges', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Next.js 15')).toBeVisible();
    await expect(page.getByText('GPT-4o')).toBeVisible();
  });

  test('footer shows attribution', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('contentinfo')).toContainText('LeadQualifier');
  });
});
