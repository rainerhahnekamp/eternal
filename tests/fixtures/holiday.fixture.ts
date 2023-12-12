import { HolidaysPage } from '../page-objects/holidays-page';
import { Fixture } from './fixture';

export type HolidaysFixtures = {
  holidays: HolidaysPage;
};

export const holidaysFixture: Fixture<HolidaysFixtures> = {
  async holidays({ page }, use) {
    await use(new HolidaysPage(page));
  },
};
