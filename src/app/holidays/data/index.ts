import { holidaysActions as allActions } from './holidays.actions';
import { provideState } from '@ngrx/store';
import { holidaysFeature } from './holidays.reducer';
import { provideEffects } from '@ngrx/effects';
import { HolidaysEffects } from './holidays.effects';

const { load, addFavourite, removeFavourite } = allActions;
export const holidaysActions = { load, addFavourite, removeFavourite };
export { fromHolidays } from './holidays.selectors';

export const provideHolidays = () => [
  provideState(holidaysFeature),
  provideEffects([HolidaysEffects]),
];
