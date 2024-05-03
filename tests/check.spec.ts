


import { expect, test } from '@playwright/test';

test('make visual regression', async ({ page }) => {
  await page.goto('http://localhost:4200/holidays');
  await expect(
    page.getByTestId('holiday-card').filter({hasText: 'Wien'})
  ).toHaveScreenshot('wien.png');
});
