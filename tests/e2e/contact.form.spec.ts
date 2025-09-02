import { test, expect } from '@playwright/test';

// Submit the contact form and expect a success toast.

test.describe('Contact form', () => {
  test('submits with success toast', async ({ page }) => {
    await page.goto('/contact');

    await page.getByLabel('Full Name *').fill('Jane Doe');
    await page.getByLabel('Email Address *').fill('jane@example.com');
    await page.getByLabel('Company').fill('Acme Inc');
    await page.getByLabel('Message *').fill('Hello team, this is a test message.');

    await page.getByRole('button', { name: /send message/i }).click();

  // Expect toast status region to announce success
  const notifications = page.locator('[role="region"][aria-label*="Notifications"]').first();
  await expect(notifications).toContainText(/message sent!/i);
  await expect(notifications).toContainText(/thank you for contacting us/i);
  });
});
