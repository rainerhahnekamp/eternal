import test from '@playwright/test';
import { storagePath } from './storage-path';

test.describe('Authentication', () => {
  test('auth0 authenticates when already signed in', async ({ page }) => {
    await page.goto('');
    await page.getByText('Application is ready').waitFor();
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.getByLabel('Username or email').fill('john.list@host.com');
    await page.getByLabel('Password').fill('John List');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.getByText('Welcome John List').waitFor();
    await page.context().storageState({ path: storagePath });
  });
});
