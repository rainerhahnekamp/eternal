import { expect, test } from '@playwright/test';
import { storagePath } from './storage-path';

test.describe('Authentication', () => {
  test('Keycloak authenticates when already signed in', async ({ page }) => {
    await page.goto('');
    await expect(page.getByText('Application is ready')).toBeVisible();
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.getByLabel('email').fill('john.list');
    await page.getByLabel('password').fill('John List');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.getByText('Welcome John List').waitFor();
    await page.context().storageState({ path: storagePath });
  });
});
