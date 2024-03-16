import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { HolidaysEffects } from './holidays.effects';
import { holidaysFeature } from './holidays.reducer';

export const provideHolidays: () => EnvironmentProviders = () =>
  makeEnvironmentProviders([
    provideState(holidaysFeature),
    provideEffects([HolidaysEffects]),
  ]);

export { fromHolidays } from './holidays.selectors';
export { holidaysActions } from './holidays.actions';
