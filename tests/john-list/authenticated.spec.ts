import { test, expect } from '@playwright/test';

test('user should be authenticated', async ({ page }) => {
  await page.goto('');

  await expect(page.getByText('Welcome John List')).toBeVisible();
});
