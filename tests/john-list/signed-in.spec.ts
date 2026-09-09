import { expect } from '@playwright/test';
import { test } from '../fixtures';

test('signed in', async ({ page }) => {
  await page.goto('');
  await expect(page.getByText('Welcome John List')).toBeVisible();
});
