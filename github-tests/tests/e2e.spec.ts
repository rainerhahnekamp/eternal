import { expect, test } from '@playwright/test';

test.describe('Eternal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
    await page.getByText('Application is ready').waitFor();
  });
  test('Home', async ({ page }) => {
    await expect(page.getByText('Welcome to Eternal')).toBeVisible();
  });

  test('Customers', async ({ page }) => {
    await page.getByRole('link', { name: 'Customers' }).click();
    await expect(page.getByTestId('row-customer')).toHaveCount(10);
  });

  test('Holidays', async ({ page }) => {
    await page.getByRole('link', { name: 'Holidays', exact: true }).click();
    await page
      .getByLabel(/Vienna/)
      .getByRole('link')
      .click();
    await page.getByLabel('Address').fill('Domgasse 5');
    await page.getByRole('button', { name: 'Send' }).click();
    await expect(page.getByRole('status')).toHaveText('Brochure sent');
  });
});
