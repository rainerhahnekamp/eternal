import { test, expect } from '@playwright/test';
import { storagePath } from './storage-path';

test.describe('Authentication', () => {
  test.skip('keycloak authenticates if already signed in', async ({ page }) => {
    await page.goto('');
    await page.getByText('Application is ready').waitFor();
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.getByLabel('Username or email').fill('john.list');
    await page.getByLabel('Password').fill('John List');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.getByText('Welcome John List').waitFor();

    let authorizeRequestSent = false;
    page.on('request', (req) => {
      if (req.url().startsWith('https://auth.eternal-holidays.net')) {
        authorizeRequestSent = true;
      }
    });
    await page.reload();

    await page.getByText('Welcome John List').waitFor();
    expect(authorizeRequestSent).toBe(true);
  });

  test('sign in and persist', async ({ page }) => {
    await page.goto('');
    await page.getByText('Application is ready').waitFor();
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.getByLabel('Username or email').fill('john.list');
    await page.getByLabel('Password').fill('John List');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.getByText('Welcome John List').waitFor();
    await page.context().storageState({ path: storagePath });
  });
});
