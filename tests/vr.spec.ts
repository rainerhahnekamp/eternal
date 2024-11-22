import { test, expect } from '@playwright/test';

test('holiday card visual regression', async ({ page }) => {
  await page.goto('http://localhost:4200/holidays');
  await expect(
    page.getByTestId('holiday-card').filter({ hasText: 'Bali' }),
  ).toHaveScreenshot('holiday-card.png');
});
