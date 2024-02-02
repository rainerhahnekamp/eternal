import { test } from '@playwright/test';
import { SidemenuPage } from 'tests/page-objects/sidemenu-page';

export const sidemenuTest = test.extend<{ sidemenuPage: SidemenuPage }>({
  async sidemenuPage({ page }, use) {
    console.log('instantiating sidemenupage...');
    const pageObject = new SidemenuPage(page);
    await use(pageObject);
  },
});
