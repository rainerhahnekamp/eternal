import { holidaysActions } from './holidays.actions';
import { holidaysFeature } from './holidays.reducer';
import { createHolidays } from '@app/holidays/model';
import { createState } from './test-utils';

describe('Holidays Reducer', () => {
  it('should add the holidays on loaded', () => {
    const holidays = createHolidays(
      { id: 1, title: 'Pyramids' },
      { id: 2, title: 'Tower Bridge' },
    );

    const state = holidaysFeature.reducer(
      createState({ holidays }),
      holidaysActions.loaded({ holidays }),
    );

    expect(state.holidays).toEqual(holidays);
  });

  it('should be no state change on load', () => {
    const initalState = createState();
    const state = holidaysFeature.reducer(
      createState(initalState),
      holidaysActions.load,
    );

    expect(state).toEqual(initalState);
  });

  it('should replace existing holidays on loaded', () => {
    const initialState = createState({
      holidays: createHolidays({ id: 1, title: 'Pyramids' }),
    });

    const state = holidaysFeature.reducer(
      initialState,
      holidaysActions.loaded({
        holidays: createHolidays({ id: 2, title: 'Tower Bridge' }),
      }),
    );

    expect(state.holidays).toEqual(
      createHolidays({ id: 2, title: 'Tower Bridge' }),
    );
  });
});
