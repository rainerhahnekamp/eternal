import { holidaysFeature } from './holidays.reducer';

export const fromHolidays = {
  get: holidaysFeature.selectHolidays
};
