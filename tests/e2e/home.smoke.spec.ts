import { test, expect } from '@playwright/test';

// Simple smoke test: load home, verify hero and CTA buttons, navigate to Solutions.

test.describe('Home smoke', () => {
  test('loads Home and navigates to Solutions', async ({ page }) => {
    await page.goto('/');

    // Hero headline rotates slogans; assert one of the known slogans appears
    const slogans = [
      'Transforming Business with AI Innovation',
      'Automate, Analyze, Accelerate Growth',
      'Your Partner in Digital Transformation',
      'AI Solutions for Modern Enterprises',
    ];

    await expect(
      page.getByRole('heading', { level: 1 }).filter({ hasText: new RegExp(slogans.map(s => s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|')) })
    ).toBeVisible();

  // CTA buttons present
  await expect(page.getByRole('button', { name: /get started/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /explore solutions/i })).toBeVisible();

  // Click Explore Solutions and verify Solutions page header
  await page.getByRole('link', { name: /explore solutions/i }).click();
    await expect(page.getByRole('heading', { level: 1, name: /ai solutions for every business/i })).toBeVisible();
  });
});
