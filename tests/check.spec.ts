import { expect, test } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/holidays');
  await expect(
    page.getByTestId('holiday-card').filter({ hasText: 'Copenhagen' }),
  ).toHaveScreenshot('copenhagen.png', );
});
