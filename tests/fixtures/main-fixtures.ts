import { test as base } from '@playwright/test';
import { ShellPageObject } from '../page-objects/shell-page-object';

export const test = base.extend<{ shellPage: ShellPageObject }>({
  shellPage: async ({ page }, use) => {
    console.log('starte ShellPageObject');
    const shellPage = new ShellPageObject(page);
    await use(shellPage);
  },
});
