import { createReducer, on } from '@ngrx/store';
import { Holiday } from '../holiday';
import { holidaysActions } from './holidays.actions';

export const holidaysFeatureKey = 'holiday';

export interface HolidaysState {
  holidays: Holiday[];
}

const initialState: HolidaysState = { holidays: [] };

export const holidaysReducer = createReducer<HolidaysState>(
  initialState,
  on(holidaysActions.findHolidaysSuccess, (state, { holidays }) => ({
    ...state,
    holidays,
  }))
);
