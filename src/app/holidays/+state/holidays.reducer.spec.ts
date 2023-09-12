import { holidaysActions } from './holidays.actions';
import { holidaysFeature } from './holidays.reducer';
import { Holiday } from '@app/holidays/model';

it('should add the holidays on findHolidaySuccess', () => {
  const holidays = [
    { id: 1, title: 'Pyramids' },
    { id: 2, title: 'Tower Bridge' },
  ] as Holiday[];

  const state = holidaysFeature.reducer(
    { holidays: [], selectedId: undefined },
    holidaysActions.loadSuccess({ holidays })
  );

  expect(state).toEqual({ holidays, selectedId: undefined });
});

it('should be no state change on findHoliday', () => {
  const state = holidaysFeature.reducer(
    { holidays: [], selectedId: undefined },
    holidaysActions.load
  );

  expect(state).toEqual({ holidays: [], selectedId: undefined });
});

it('should replace existing holidays on findHolidaySuccess', () => {
  const initialState = {
    holidays: [{ id: 1, title: 'Pyramids' }] as Holiday[],
    selectedId: undefined,
  };

  const state = holidaysFeature.reducer(
    initialState,
    holidaysActions.loadSuccess({
      holidays: [{ id: 2, title: 'Tower Bridge' } as Holiday],
    })
  );

  expect(state.holidays).toEqual([{ id: 2, title: 'Tower Bridge' } as Holiday]);
});
