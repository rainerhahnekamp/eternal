import { expect, test } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:4200/');
  await page.getByTestId('btn-customers').click();
  await expect(page.getByRole('heading', { name: 'Customer' })).toBeVisible();
});
