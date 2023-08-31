import { Fixture } from './fixture';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import * as path from 'path';
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
      const filename = path.join(process.cwd(), storagePath);
      let isAuthenticated = false;
      if (existsSync(filename)) {
        const now = new Date().getTime() + 1_000 * 60;
        const data: SessionData = JSON.parse(
          await readFile(filename, { encoding: 'utf-8' }),
        );

        isAuthenticated = !data.cookies
          .filter((cookie) => cookie.expires && cookie.domain?.match(/auth0/))
          .some((cookie) => {
            if (cookie.expires && cookie.domain?.match(/auth0/)) {
              const expires = cookie.expires * 1000;
              const isExpired = expires < now;
              console.log(
                'checking: %d vs %d %s',
                cookie.expires * 1000,
                now,
                isExpired,
              );
              return isExpired;
            }
            throw new Error('cookie without expires or domain');
          });
      }

      if (!isAuthenticated) {
        await authenticate(page);
      }

      await use();
    },
    { auto: true },
  ],
};
