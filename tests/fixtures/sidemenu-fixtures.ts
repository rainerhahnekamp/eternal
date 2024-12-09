import { HolidaysPageObject } from 'tests/page-objects/holidays-page-object';
import { test } from '@playwright/test';
import { SidemenuPageObject } from 'tests/page-objects/sidemenu-page-object';

export interface SidemenuFixtures {
  sidemenuPageObject: SidemenuPageObject;
}

export const testWithSidemenu = test.extend<SidemenuFixtures>({
  async sidemenuPageObject({ page }, use) {
    await use(new SidemenuPageObject(page));
  },
});
