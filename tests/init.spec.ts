import { test, expect } from '@playwright/test';

test.describe('init', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
    await page.getByText('Application is ready').waitFor();
  });

  test('test', async ({ page }) => {
    await page.getByRole('link', { name: 'Holidays', exact: true }).click();
    await page
      .getByLabel('Vienna')
      .getByRole('link', { name: 'Get a Brochure' })
      .click();
    await page.getByLabel('Address').fill('Domgasse 5');
    await page.getByRole('button', { name: 'Send' }).click();
    await expect(page.getByText('Brochure sent')).toBeVisible();
  });
});
