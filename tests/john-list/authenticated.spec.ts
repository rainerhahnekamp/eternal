import { test } from '../test';
import { expect } from '@playwright/test';

test('authenticated', async ({ page }) => {
  await page.goto('');
  await expect(page.getByText('Welcome John List')).toBeVisible();
});
