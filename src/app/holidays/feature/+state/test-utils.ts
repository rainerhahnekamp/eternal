import { HolidaysState } from '@app/holidays/feature/+state/holidays.reducer';

export const createState = (values: Partial<HolidaysState> = {}) => ({
  ...{ holidays: [], favouriteIds: [] },
  ...values,
});
