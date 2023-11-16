import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { holidaysFeature } from '@app/holidays/data/holidays.reducer';
import { HolidaysEffects } from '@app/holidays/data/holidays.effects';

export { HolidaysRepository } from './holidays-repository.service';

export const provideHolidays = () => [
  provideState(holidaysFeature),
  provideEffects([HolidaysEffects]),
];
