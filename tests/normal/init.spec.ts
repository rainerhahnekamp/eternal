import { test, expect } from '@playwright/test';

test('test 1', async ({ page }) => {
  await page.goto('http://localhost:4200/');
  await page.getByTestId('btn-holidays').click();
  await page.getByTestId('btn-customers').click();
  await page.getByTestId('btn-holidays').click();
  await page.getByTestId('btn-customers').click();
  await page.getByTestId('btn-holidays').click();
  await expect(page.locator('#holiday-card-6')).toContainText('Vienna');
});