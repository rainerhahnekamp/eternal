import { expect, test } from '@playwright/test';

test.describe('Visual Regression', () => {
  test.describe('Application', () => {
    test('home screenshot', async ({ page }) => {
      await page.goto('');
      await page.getByRole('heading', { name: 'Welcome to Eternal' }).waitFor();
      await expect(page).toHaveScreenshot('home.png');
    });
  });
});
