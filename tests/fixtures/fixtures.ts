import { test as base, mergeTests } from '@playwright/test';
import { SidemenuPageObject } from 'tests/page-objects/sidemenu-page-object';

export const test = base.extend<{ sidemenu: SidemenuPageObject }>({
  sidemenu: [
    async ({ page }, use) => {
      console.log('instantiating fixture...');
      await use(new SidemenuPageObject(page));
    },
    { auto: true },
  ],
});
