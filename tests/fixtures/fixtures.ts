import { test as base, mergeTests } from '@playwright/test';
import { SidemenuPageObject } from '../page-objects/sidemenu-page-object';
import { tokenCheckerTest } from './token-valid-checker';

 const sidemenuFixtures = base.extend<{ sidemenu: SidemenuPageObject }>({
  sidemenu: async ({ page }, use) => {
    console.log('instantiating fixture...');
    await use(new SidemenuPageObject(page));
  }
});

export const test = mergeTests(sidemenuFixtures, tokenCheckerTest);
