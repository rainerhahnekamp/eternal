import { test, expect } from '@playwright/test';

test('should rename Latitia to Laetitia', async ({ page }) => {
  await page.goto('');
  await expect(page.getByText('Application is ready')).toBeVisible();
  await page.getByRole('link', { name: 'Customers' }).click();
  await page
    .getByTestId('row-customer')
    .filter({ hasText: 'Latitia' })
    .getByTestId('btn-edit')
    .click();
  await page.getByRole('textbox', { name: 'Firstname' }).fill('Laetitia');
  await page.getByRole('button', { name: 'Save' }).click();

  await expect(page.getByLabel('Laetitia')).toBeVisible();
  await expect(page.getByLabel('Latitia')).toBeVisible();
});
