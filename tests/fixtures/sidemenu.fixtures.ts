import { SidemenuPageObject } from '../page-objects/sidemenu.page-object';
import { test as base } from '@playwright/test';

export interface SidemenuFixtures {
  sidemenu: SidemenuPageObject;
}

export interface HolidaysFixtures {
  holidays: SidemenuPageObject;
}

type Fixture<FixtureType extends Record<string, unknown>> = Parameters<
  typeof base.extend<FixtureType>
>[0];

export const sidemenuFixture: Fixture<{ sidemenu: SidemenuPageObject }> = {
  async sidemenu({ page }, use) {
    const pageObject = new SidemenuPageObject(page);
    await use(pageObject);
  },
};
