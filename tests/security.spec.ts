import { test, expect } from '@playwright/test';

test.describe('security', () => {
  test.describe('authenticated', () => {
    test.use({ storageState: 'john.list.json' });
    test('authenticated', async ({ page }) => {
      await page.goto('');
      const coverageData = await page.coverage.stopJSCoverage();
      await page.getByText('Application is ready').waitFor();
      await expect(page.getByText('Welcome John List')).toBeVisible();
    });
  });

  test.describe('not authenticated', () => {
    test('not authenticated', async ({ page }) => {
      await page.goto('');
      await page.getByText('Application is ready').waitFor();
      await expect(page.getByText('Welcome John List')).toBeVisible();
    });
  });
});
