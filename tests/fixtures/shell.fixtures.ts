import { SidemenuPage } from '../page-objects/sidemenu-page';
import { test } from '@playwright/test';

export interface ShellFixtures {
  sidemenuPage: SidemenuPage;
}

export const shellFixtures = test.extend<ShellFixtures>({
  async sidemenuPage({ page }, use) {
    await use(new SidemenuPage(page));
  },
});
