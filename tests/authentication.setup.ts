import test from '@playwright/test';
import { storagePath } from './storage-path';

test.describe('Authentication', () => {
  test('auth0 authenticates when already signed in', async ({ page }) => {
    await page.goto('');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.getByPlaceholder('yours@example.com').fill('john.list@host.com');
    await page.getByPlaceholder('your password').fill('John List');
    await page.getByRole('button', { name: 'Log In' }).click();
    await page.getByText('Welcome John List').waitFor();
    await page.context().storageState({ path: storagePath });
  });
});
