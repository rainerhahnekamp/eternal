import test from '@playwright/test';
import { HolidaysPage } from 'tests/page-objects/holidays-page';

export type HolidaysFixture = {
  holidaysPage: HolidaysPage;
  timeMeasure: boolean;
};

export const holidaysTest = test.extend<HolidaysFixture>({
  async holidaysPage({ page }, use) {
    console.log('instanziiere HolidaysPage...');
    await use(new HolidaysPage(page));

    console.log('Beende Fixture');
  },
  timeMeasure: [
    async ({ page }, use) => {
      const start = new Date();
      await use(true);
      const end = new Date();

      // console.log(`Dauer: ${end.getTime() - start.getTime()}`);
    },
    { auto: true },
  ],
});
