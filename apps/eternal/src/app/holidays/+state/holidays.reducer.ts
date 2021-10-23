import { createFeature, createReducer, on } from '@ngrx/store';
import { Holiday } from '../holiday';
import { holidaysActions } from './holidays.actions';

export interface HolidaysState {
  holidays: Holiday[];
}

const initialState: HolidaysState = { holidays: [] };

export const holidaysFeature = createFeature({
  name: 'holiday',
  reducer: createReducer(
    initialState,
    on(holidaysActions.findHolidaysSuccess, (state, { holidays }) => ({
      ...state,
      holidays
    }))
  )
});
