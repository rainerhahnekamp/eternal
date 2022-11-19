import { Holiday } from '@eternal/holidays/model';
import { createFeature, createReducer, on } from '@ngrx/store';
import { holidaysActions } from './holidays.actions';
import { LoadStatus } from '@eternal/shared/ngrx-utils';

export interface HolidaysState {
  holidays: Holiday[];
  favouriteIds: number[];
  loadStatus: LoadStatus;
}

const initialState: HolidaysState = {
  holidays: [],
  favouriteIds: [],
  loadStatus: 'not loaded',
};

export const holidaysFeature = createFeature({
  name: 'holidays',
  reducer: createReducer<HolidaysState>(
    initialState,
    on(
      holidaysActions.load,
      (state): HolidaysState => ({
        ...state,
        loadStatus: 'loading',
      })
    ),
    on(
      holidaysActions.loaded,
      (state, { holidays }): HolidaysState => ({
        ...state,
        loadStatus: 'loaded',
        holidays,
      })
    ),
    on(holidaysActions.favouriteAdded, (state, { id }): HolidaysState => {
      if (state.favouriteIds.includes(id)) {
        return state;
      }

      return { ...state, favouriteIds: [...state.favouriteIds, id] };
    }),
    on(
      holidaysActions.favouriteRemoved,
      (state, { id }): HolidaysState => ({
        ...state,
        favouriteIds: state.favouriteIds.filter(
          (favouriteId) => favouriteId !== id
        ),
      })
    )
  ),
});
