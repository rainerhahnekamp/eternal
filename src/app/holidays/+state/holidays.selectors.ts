import { holidaysFeature } from './holidays.reducer';
import { createSelector } from '@ngrx/store';

const selectSelected = createSelector(
  holidaysFeature.selectHolidays,
  holidaysFeature.selectSelectedId,
  (holidays, selectedId) =>
    holidays.find((holiday) => holiday.id === selectedId),
);

export const fromHolidays = {
  holidays: holidaysFeature.selectHolidays,
  selectSelected,
};
