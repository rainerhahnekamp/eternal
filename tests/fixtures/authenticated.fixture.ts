import { Fixture } from './fixture';
import { readFile } from 'fs/promises';
import { storagePath } from '../storage-path';
import { Page } from '@playwright/test';

export type AuthenticatedFixture = {
  authenticatedFixture: void;
};

type SessionData = {
  cookies: { domain?: string; expires?: number }[];
};

async function authenticate(page: Page) {
  await page.goto('');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.getByPlaceholder('yours@example.com').fill('john.list@host.com');
  await page.getByPlaceholder('your password').fill('John List');
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.getByText('Welcome John List').waitFor();
  await page.context().storageState({ path: storagePath });
}

export const authenticatedFixture: Fixture<AuthenticatedFixture> = {
  authenticatedFixture: [
    async ({ page }, use) => {
      const now = new Date().getTime() + 1_000 * 60;
      const data: SessionData = JSON.parse(
        await readFile(storagePath, { encoding: 'utf-8' }),
      );
      const hasExpired = data.cookies.some((cookie) => {
        if (cookie.expires && cookie.domain?.match(/auth0/)) {
          const expires = cookie.expires * 1000;
          return expires < now;
        }
        return false;
      });

      if (hasExpired) {
        await authenticate(page);
      }

      await use();
    },
    { auto: true },
  ],
};
