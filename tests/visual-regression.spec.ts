import { expect, test } from '@playwright/test';

test.describe('Visual Regression', () => {
  test('holiday card', async ({ page }) => {
    await page.goto(
      'http://localhost:6006/iframe.html?id=holiday-card--favourite-look&viewMode=story',
    );
    // await page.getByTestId('btn-brochure').hover();
    await expect(page).toHaveScreenshot('holiday-card.png', { threshold: 0 });
  });
});
