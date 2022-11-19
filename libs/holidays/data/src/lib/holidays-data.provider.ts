import { provideState } from '@ngrx/store';
import { holidaysFeature } from './holidays.reducer';
import { provideEffects } from '@ngrx/effects';
import { HolidaysEffects } from './holidays.effects';

export const holidaysDataProvider = [
  provideState(holidaysFeature),
  provideEffects([HolidaysEffects]),
];
