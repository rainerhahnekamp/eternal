import { test } from '@playwright/test';
import { ShellPageObject } from 'tests/page-objects/shell-page-object';

type ShellFixtures = {
  shellPageObject: ShellPageObject;
  log: Record<string, never>;
};

export const shellTest = test.extend<ShellFixtures>({
  shellPageObject: [
    async ({ page }, use) => {
      console.log('ShellPage');
      //beforeEach
      await use(new ShellPageObject(page));
      // afterEach
    },
    { auto: true },
  ],

  log: [
    async ({ page }, use) => {
      console.log('logging %o', new Date());
      await use({});
    },
    { auto: true },
  ],
});
