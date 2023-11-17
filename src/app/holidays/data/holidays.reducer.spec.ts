import {
  holidaysFeature,
  HolidaysState,
} from '@app/holidays/data/holidays.reducer';
import { holidaysActions } from '@app/holidays/data/holidays.actions';

describe('Holidays Reducer', () => {
  it('should add a favourite', () => {
    const state: HolidaysState = {
      holidays: [],
      loadStatus: 'loaded',
      favouriteIds: [1, 2],
    };

    const newState = holidaysFeature.reducer(
      state,
      holidaysActions.favouriteAdded({ id: 3 }),
    );

    expect(newState).toEqual({
      holidays: [],
      loadStatus: 'loaded',
      favouriteIds: [1, 2, 3],
    });
  });

  it('should not add an existing favourite', () => {
    const state: HolidaysState = {
      holidays: [],
      loadStatus: 'loaded',
      favouriteIds: [1, 2, 3],
    };

    const newState = holidaysFeature.reducer(
      state,
      holidaysActions.favouriteAdded({ id: 3 }),
    );

    expect(newState.favouriteIds).toEqual([1, 2, 3]);
  });

  it('should add it immutable', () => {
    const state: HolidaysState = {
      holidays: [],
      loadStatus: 'loaded',
      favouriteIds: [1, 2],
    };

    holidaysFeature.reducer(state, holidaysActions.favouriteAdded({ id: 3 }));

    expect(state).toEqual({
      holidays: [],
      loadStatus: 'loaded',
      favouriteIds: [1, 2],
    });
  });
});
