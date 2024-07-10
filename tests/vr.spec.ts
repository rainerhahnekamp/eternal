import { test, expect } from '@playwright/test';

test('should do vr on holiday card', async ({ page }) => {
  await page.goto('http://localhost:4200/holidays');
  await expect(
    page.getByTestId('holiday-card').filter({ hasText: 'Wien' }),
  ).toHaveScreenshot('detroit.png');
});
