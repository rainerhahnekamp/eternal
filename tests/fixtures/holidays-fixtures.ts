import { HolidaysPageObject } from 'tests/page-objects/holidays-page-object';
import { test } from '@playwright/test';
import { BlobOptions } from 'buffer';

export interface HolidaysFixtures {
  holidaysPageObject: HolidaysPageObject;
  timeMeasure: boolean;
}

export const testWithHolidays = test.extend<HolidaysFixtures>({
  async holidaysPageObject({ page }, use) {
    const holidaysPageObject = new HolidaysPageObject(page);
    await use(holidaysPageObject);
  },
  timeMeasure: [
    async ({}, use) => {
      const start = new Date().getTime();
      await use(true);
      const end = new Date().getTime();
      console.log('Duration: ', end - start, 'ms');
    },
    { auto: true },
  ],
});
