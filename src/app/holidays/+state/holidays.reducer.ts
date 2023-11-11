import { createFeature, createReducer, on } from '@ngrx/store';
import { Holiday } from '../model';
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
    on(
      holidaysActions.loadSuccess,
      (state, { holidays }): HolidaysState => ({
        ...state,
        holidays,
      }),
    ),
    on(
      holidaysActions.select,
      (state, { id }): HolidaysState => ({
        ...state,
        selectedId: id,
      }),
    ),
    on(
      holidaysActions.unselect,
      (state): HolidaysState => ({
        ...state,
        selectedId: undefined,
      }),
    ),
  ),
});
