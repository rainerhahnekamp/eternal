import { test, expect } from '@playwright/test';

test('holiday card', async ({ page }) => {
  await page.goto(
    'http://localhost:6006/iframe.html?id=holiday-card-component--sold-out&viewMode=story',
  );
  await expect(page.getByTestId('holiday-card')).toHaveScreenshot(
    'sold-out.png',
    { mask: [page.locator('mat-card-title')] },
  );
});
