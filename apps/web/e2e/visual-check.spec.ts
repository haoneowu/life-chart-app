import { test, expect } from '@playwright/test';

const TARGET_URL = process.env.TARGET_URL || 'https://life-chart-app.vercel.app';

test('Life Chart Visual Check', async ({ page }) => {
  console.log(`Navigating to ${TARGET_URL}`);
  await page.goto(TARGET_URL);

  // Check title
  await expect(page).toHaveTitle(/Life Chart/i);

  // Check for Input Form
  const dateInput = page.locator('input[type="date"]');
  await expect(dateInput).toBeVisible();

  // Fill Date
  await dateInput.fill('1990-01-01');

  // Fill Lat/Lon (Optional but good to be explicit)
  await page.locator('input[placeholder="Lat"]').fill('40.7128');
  await page.locator('input[placeholder="Lon"]').fill('-74.0060');

  // Click Generate
  const button = page.locator('button', { hasText: 'Generate Chart' });
  await button.click();

  // Wait for loading to finish and chart to appear
  // The chart container has class 'w-full h-[400px]' or similar, or check for canvas
  // The 'Reset' button appears when data is loaded
  await expect(page.locator('button', { hasText: 'Reset' })).toBeVisible({ timeout: 15000 });

  // Take Screenshot
  await page.screenshot({ path: 'e2e-result.png', fullPage: true });
  console.log('Screenshot saved to e2e-result.png');
});
