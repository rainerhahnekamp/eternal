import { createFeature, createReducer, on } from '@ngrx/store';
import { Holiday } from '../model/holiday';
import { holidaysActions } from './holidays.actions';

export interface HolidaysState {
  holidays: Holiday[];
  selectedId: number | undefined;
}

const initialState: HolidaysState = { holidays: [], selectedId: undefined };

export const holidaysFeature = createFeature({
  name: 'holiday',
  reducer: createReducer(
    initialState,
    on(holidaysActions.loadSuccess, (state, { holidays }) => ({
      ...state,
      holidays
    })),
    on(holidaysActions.select, (state, { id }) => ({
      ...state,
      selectedId: id
    })),
    on(holidaysActions.unselect, (state) => ({
      ...state,
      selectedId: undefined
    }))
  )
});
