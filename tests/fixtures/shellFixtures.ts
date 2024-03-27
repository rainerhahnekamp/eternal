import { test } from '@playwright/test';
import { ShellPageObject } from 'tests/page-objects/shell-page-object';

type ShellFixtures = { shellPageObject: ShellPageObject };

export const shellTest = test.extend<ShellFixtures>({
  async shellPageObject({ page }, use) {
    await use(new ShellPageObject(page));
  },
});
