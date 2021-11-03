import { Holiday } from '../holiday';
import { HolidaysState } from './holidays.reducer';
import { fromHolidays } from './holidays.selectors';

describe('Holidays Selectors', () => {
  it('should select the holidays', () => {
    const state: HolidaysState = {
      holidays: [
        { id: 1, title: 'Pyramids' },
        { id: 2, title: 'Tower Bridge' }
      ] as Holiday[]
    };

    expect(fromHolidays.get.projector(state)).toEqual([
      { id: 1, title: 'Pyramids' },
      { id: 2, title: 'Tower Bridge' }
    ] as Holiday[]);
  });
});
