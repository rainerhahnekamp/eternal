import { Holiday } from '../holiday';
import { holidaysActions } from './holidays.actions';
import { holidaysReducer } from './holidays.reducer';

describe('Holidays Reducer', () => {
  it('should add the holidays on findHolidaySuccess', () => {
    const holidays = [
      { id: 1, title: 'Pyramids' },
      { id: 2, title: 'Tower Bridge' }
    ] as Holiday[];

    const state = holidaysReducer(
      { holidays: [] },
      holidaysActions.findHolidaysSuccess({ holidays })
    );

    expect(state).toEqual({ holidays });
  });

  it('should be no state change on findHoliday', () => {
    const state = holidaysReducer({ holidays: [] }, holidaysActions.findHolidays());

    expect(state).toEqual({ holidays: [] });
  });

  it('should replace existing holidays on findHolidaySuccess', () => {
    const initialState = { holidays: [{ id: 1, title: 'Pyramids' }] as Holiday[] };

    const state = holidaysReducer(
      initialState,
      holidaysActions.findHolidaysSuccess({
        holidays: [{ id: 2, title: 'Tower Bridge' } as Holiday]
      })
    );

    expect(state.holidays).toEqual([{ id: 2, title: 'Tower Bridge' } as Holiday]);
  });
});
