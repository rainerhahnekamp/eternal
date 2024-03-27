import test from '@playwright/test';
import { HolidaysBrochurePageObject } from 'tests/page-objects/holidays-brochure-page-object';
import { HolidaysPageObject } from 'tests/page-objects/holidays-page-object';

type HolidaysFixtures = {
  holidaysPageObject: HolidaysPageObject;
  brochurePageObject: HolidaysBrochurePageObject;
};

export const holidaysTest = test.extend<HolidaysFixtures>({
  async holidaysPageObject({ page }, use) {
    await use(new HolidaysPageObject());
  },

  async brochurePageObject({ page }, use) {
    await use(new HolidaysBrochurePageObject());
  },
});
