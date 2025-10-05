import { test, expect } from '@playwright/test';

test('create and delete entry', async ({ page }) => {
  test.setTimeout(60000);
  await page.goto('/');
  
  // Create entry
  await page.click('text=Create New Technician');
  await page.fill('input[type="text"]', 'Test Entry');
  await page.fill('textarea', 'Test description');
  await page.fill('input[placeholder="Enter technician name..."]', 'Test Tecnhnician');
  await page.fill('input[type="number"]', '5');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/');
  
  // Verify created
  await expect(page.locator('text=Test Entry')).toBeVisible();
  
  // Delete entry
  const cards = page.locator('.bg-white');
  const targetCard = cards.filter({ hasText: 'Test Entry' });
  await targetCard.locator('button:has-text("Delete")').click();
  
  // Verify deleted
  await expect(page.locator('text=Test Entry')).not.toBeVisible();
});