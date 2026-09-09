import { test as base } from '@playwright/test';
import { HolidaysPageObject } from '../page-objects/holidays-page-object';

export const test = base.extend<{ holidaysPage: HolidaysPageObject }>({
  holidaysPage: async ({ page }, use) => {
    const shellPage = new HolidaysPageObject(page);
    await use(shellPage);
  },
});
