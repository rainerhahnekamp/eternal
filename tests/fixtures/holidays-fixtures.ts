import { test } from '@playwright/test';
import { HolidaysPage } from 'tests/page-objects/holidays-page';
import { SidemenuPage } from 'tests/page-objects/sidemenu-page';

export const holidaysTest = test.extend<{ holidaysPage: HolidaysPage }>({
  async holidaysPage({ page }, use) {
    const pageObject = new HolidaysPage(page);
    await use(pageObject);
  },
});
