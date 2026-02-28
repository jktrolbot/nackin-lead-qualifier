import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
    // Wait for content to load
    await page.waitForSelector('h1', { timeout: 10_000 });
  });

  test('renders the Lead Dashboard heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Lead Dashboard/i })).toBeVisible();
  });

  test('shows metric cards', async ({ page }) => {
    await expect(page.getByText('Total Leads')).toBeVisible();
    await expect(page.getByText(/Hot Leads/)).toBeVisible();
    await expect(page.getByText('Conversion Rate')).toBeVisible();
    await expect(page.getByText('Avg Score')).toBeVisible();
  });

  test('shows the leads table', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /Lead/i })).toBeVisible();
  });

  test('shows demo leads in the table', async ({ page }) => {
    // Demo data has Sarah Johnson
    await expect(page.getByText('Sarah Johnson')).toBeVisible();
  });

  test('search filter narrows table results', async ({ page }) => {
    const input = page.getByPlaceholder('Search leads...');
    await input.fill('Sarah');
    await expect(page.getByText('Mike Chen')).not.toBeVisible();
    await expect(page.getByText('Sarah Johnson')).toBeVisible();
  });

  test('score filter shows only hot leads', async ({ page }) => {
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /Hot/i }).click();
    // Emma Wilson is cold, should not be visible
    await expect(page.getByText('Emma Wilson')).not.toBeVisible();
  });

  test('clicking view button opens lead detail dialog', async ({ page }) => {
    // Click the first view (eye) button
    await page.getByRole('button', { name: '' }).first().click();
    // Dialog should open
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('refresh button is functional', async ({ page }) => {
    const refreshBtn = page.getByRole('button', { name: /Refresh/i });
    await expect(refreshBtn).toBeEnabled();
    await refreshBtn.click();
    // Should not crash
    await expect(page.getByText('Total Leads')).toBeVisible();
  });

  test('shows charts section', async ({ page }) => {
    await expect(page.getByText('Leads Over Time')).toBeVisible();
    await expect(page.getByText('Score Distribution')).toBeVisible();
  });
});
