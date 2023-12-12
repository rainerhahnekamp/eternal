import { SidemenuPage } from '../page-objects/sidemenu-page';
import { Fixture } from './fixture';

export type ShellFixtures = {
  sidemenuPage: SidemenuPage;
};

export const shellFixtures: Fixture<ShellFixtures> = {
  async sidemenuPage({ page }, use) {
    await use(new SidemenuPage(page));
  },
};
