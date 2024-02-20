import { test } from '@playwright/test';
import { HolidaysPage } from 'tests/page-objects/holidays-page';

export const holidaysFixture = test.extend<{
  holidaysPage: HolidaysPage;
}>({
  async holidaysPage({ page }, use) {
    console.log('instantiating holidaysPage');
    const holidaysPage = new HolidaysPage(page);
    await use(holidaysPage);
  },
});
