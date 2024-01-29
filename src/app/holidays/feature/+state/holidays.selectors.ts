import { holidaysFeature } from './holidays.reducer';
import { createSelector } from '@ngrx/store';

const selectHolidaysWithFavourite = createSelector(
  holidaysFeature.selectHolidays,
  holidaysFeature.selectFavouriteIds,
  (holidays, favouriteIds) =>
    holidays.map((holiday) => ({
      ...holiday,
      isFavourite: favouriteIds.includes(holiday.id),
    })),
);

const selectSelected = createSelector(
  holidaysFeature.selectSelectedId,
  selectHolidaysWithFavourite,
  (id, holidays) => holidays.find((holiday) => holiday.id === id),
);

export const fromHolidays = {
  get: holidaysFeature.selectHolidays,
  selectHolidaysWithFavourite,
  selectSelected
};
