import { SidemenuPage } from '../page-objects/sidemenu-page';
import { test } from '@playwright/test';

export const shellTest = test.extend<{ sidemenuPage: SidemenuPage }>({
  sidemenuPage: [
    async ({ page }, use) => {
      console.log('aktiviere Sidemenupage...');
      await use(new SidemenuPage(page));
    },
    { auto: true },
  ],
});
