import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { holidaysFeature } from '@app/holidays/data/holidays.reducer';
import { HolidaysEffects } from '@app/holidays/data/holidays.effects';
import { holidaysActions as actions } from '@app/holidays/data/holidays.actions';

const { load, addFavourite, removeFavourite } = actions;
export const holidaysActions = { load, addFavourite, removeFavourite };
export { fromHolidays } from './holidays.selectors';

export const provideHolidays = () => [
  provideState(holidaysFeature),
  provideEffects([HolidaysEffects]),
];
