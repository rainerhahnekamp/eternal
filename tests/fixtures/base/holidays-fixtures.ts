import test from '@playwright/test';
import { HolidaysPageObject } from '../../page-objects/holidays-page-object';

export interface HolidaysFixtures {
  holidaysPageObject: HolidaysPageObject;
}

export const holidaysTest = test.extend<HolidaysFixtures>({
  holidaysPageObject: async ({ page }, use) => {
    await use(new HolidaysPageObject(page));
  },
});
