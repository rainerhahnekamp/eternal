import { test, expect } from '@playwright/test';

test('holiday card', async ({ page }) => {
  await page.goto(
    'http://localhost:6006/iframe.html?id=holiday-card-component--on-sale&viewMode=story',
  );
  await expect(page.locator('app-holiday-card')).toHaveScreenshot(
    'holiday-card.png',
    { mask: [page.locator('mat-card-subtitle')], maskColor: 'white' },
  );
});
