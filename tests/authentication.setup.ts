import test from '@playwright/test';
import { storagePath } from './storage-path';
import * as path from 'path';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';

type SessionData = {
  cookies: { domain?: string; expires?: number }[];
};

async function isAuthenticated() {
  const filename = path.join(process.cwd(), storagePath);
  if (existsSync(filename)) {
    const now = new Date().getTime() + 1_000 * 60;
    const data: SessionData = JSON.parse(
      await readFile(filename, { encoding: 'utf-8' }),
    );

    return !data.cookies
      .filter((cookie) => cookie.expires && cookie.domain?.match(/auth0/))
      .some((cookie) => {
        if (cookie.expires && cookie.domain?.match(/auth0/)) {
          const expires = cookie.expires * 1000;
          return expires < now;
        }
        throw new Error('cookie without expires or domain');
      });
  }

  return false;
}

test.describe('Authentication', () => {
  test('auth0 authenticates when already signed in', async ({ page }) => {
    if (await isAuthenticated()) {
      return;
    }
    await page.goto('');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.getByPlaceholder('yours@example.com').fill('john.list@host.com');
    await page.getByPlaceholder('your password').fill('John List');
    await page.getByRole('button', { name: 'Log In' }).click();
    await page.getByText('Welcome John List').waitFor();
    await page.context().storageState({ path: storagePath });
  });
});
