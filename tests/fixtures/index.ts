import { test as base, mergeTests } from '@playwright/test';
import { ShellPageObject } from '../page-objects/shell-page-object';

const test1 = base.extend<{ shell: ShellPageObject }>({
  shell: async ({ page }, use) => {
    await use(new ShellPageObject(page));
  },
});

const test2 = base.extend<{ shell2: ShellPageObject }>({
  shell2: async ({ page }, use) => {
    await use(new ShellPageObject(page));
  },
});

export const test = mergeTests(test1, test2);
