import { test, expect } from '@playwright/test';

test('Visuelle Regression', async ({ page }) => {
  await page.goto(
    'http://localhost:6006/iframe.html?id=isolated-component--favourite&viewMode=story',
  );
  await expect(page.locator('app-holiday-card')).toHaveScreenshot(
    'holiday-card.png',
  );
});
