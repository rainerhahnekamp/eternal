import { SidemenuPage } from '../page-objects/sidemenu-page';
import { test } from '@playwright/test';

export const shellTest = test.extend<{ sidemenuPage: SidemenuPage }>({
  async sidemenuPage({ page }, use) {
    await use(new SidemenuPage(page));
  },
});
