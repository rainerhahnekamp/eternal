import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('');
  await page.getByTestId('btn-customers').click();
});
