import { expect } from '@playwright/test';
import { storagePath } from './storage-path';
import { test } from './fixtures/test';

test.describe('Authenticated', () => {
  test.use({ storageState: storagePath });
  test('user should be authenticated', async ({ page }) => {
    await page.goto('');
    await expect(page.getByText('Welcome John List')).toBeVisible();
  });
});
