import { test as base } from 'playwright/types/test';
import { SidemenuPageObject } from '../page-objects/sidemenu.page-object';
import { HolidaysFixtures, SidemenuFixtures } from './sidemenu.fixtures';

export const test = base.extend<SidemenuFixtures & HolidaysFixtures>({
  sidemenu: [
    async ({ page }, use) => {
      const pageObject = new SidemenuPageObject(page);
      await use(pageObject);
    },
    { auto: true },
  ],
  holidays: async ({ page }, use) => {},
});
