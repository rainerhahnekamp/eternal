import { SidemenuPageObject } from '../page-objects/sidemenu.page-object';
import { Fixture } from './fixture';

export type SidemenuFixtures = {
  sidemenu: SidemenuPageObject;
};

export const sidemenuFixtures: Fixture<SidemenuFixtures> = {
  async sidemenu({ page }, use) {
    const pageObject = new SidemenuPageObject(page);
    await use(pageObject);
  },
};
