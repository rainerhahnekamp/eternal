import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('');

  await page.getByRole('link', { name: 'Holidays', exact: true });
  await page
    .getByTestId('holiday-card')
    .getByText('Vienna')
    .first()
    .locator('xpath=../..')
    .locator('+ *');
});
