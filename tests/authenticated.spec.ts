import { expect, test } from '@playwright/test';
import { storagePath } from './storage-path';

test.use({ storageState: storagePath });
test.describe('Authenticated', () => {
  test('user should be authenticated', async ({ page }) => {
    await page.goto('');
    await expect(page.getByText('Welcome John List')).toBeVisible();
  });
});
