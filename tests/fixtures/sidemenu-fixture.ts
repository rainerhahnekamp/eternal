import { test } from '@playwright/test';
import { SidemenuPage } from 'tests/page-objects/sidemenu-page';

export const sidemenuFixture = test.extend<{
  sidemenuPage: SidemenuPage;
}>({
  async sidemenuPage({ page }, use) {
    console.log('instantiating sidemenuPage');
    const sidemenuPage = new SidemenuPage(page);
    await use(sidemenuPage);
  },
});
