import { test } from '@playwright/test';
import { ShellPageObject } from '../../page-objects/shell-page-object';

interface ShellFixtures {
  shellPageObject: ShellPageObject;
}

export const shellTests = test.extend<ShellFixtures>({
  shellPageObject: async function ({ page }, use) {
    console.log('instantiate Shell Page Object');
    await use(new ShellPageObject(page));
  },
});
