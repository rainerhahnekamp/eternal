import { test, expect } from '@playwright/test';

test('test1', async ({ page }) => {
  await page.goto('http://localhost:4200/');
  await page.getByTestId('btn-holidays').click();
  await page.locator('mat-label').click();
  await page.getByTestId('inp-search').fill('L');
  await page.getByTestId('inp-search').press('Enter');
  await page.getByRole('button', { name: 'Search' }).click();
  await expect(page.locator('#holiday-card-3')).toContainText('Lübeck');
});
