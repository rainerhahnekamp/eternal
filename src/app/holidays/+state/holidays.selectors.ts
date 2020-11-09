import {createFeatureSelector, createSelector} from '@ngrx/store';
import {holidaysFeatureKey, HolidaysState} from './holidays.reducer';

const stateSelector = createFeatureSelector<HolidaysState>(holidaysFeatureKey);

export const fromHolidays = {
  get: createSelector(stateSelector, ({holidays}) => holidays)
};
