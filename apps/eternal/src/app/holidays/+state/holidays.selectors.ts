import { holidaysFeature } from './holidays.reducer';
import { createSelector } from '@ngrx/store';

export const fromHolidays = {
  holidays: holidaysFeature.selectHolidays,
  selected: createSelector(
    holidaysFeature.selectHolidays,
    holidaysFeature.selectSelectedId,
    (holidays, selectedId) => holidays.find((holiday) => holiday.id === selectedId)
  )
};
