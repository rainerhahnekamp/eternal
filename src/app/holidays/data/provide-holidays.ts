import { provideState } from '@ngrx/store';
import { holidaysFeature } from '@app/holidays/data/holidays.reducer';
import { provideEffects } from '@ngrx/effects';
import { HolidaysEffects } from '@app/holidays/data/holidays.effects';

export const provideHolidays = () => [
  provideState(holidaysFeature),
  provideEffects([HolidaysEffects]),
];
