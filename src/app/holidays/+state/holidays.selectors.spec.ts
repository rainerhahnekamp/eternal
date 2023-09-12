import { fromHolidays } from './holidays.selectors';
import { HolidaysState } from './holidays.reducer';
import { Holiday } from '@app/holidays/model';

it('should select the holidays', () => {
  const state: HolidaysState = {
    holidays: [
      { id: 1, title: 'Pyramids' },
      { id: 2, title: 'Tower Bridge' },
    ] as Holiday[],
    selectedId: undefined,
  };

  expect(fromHolidays.holidays.projector(state)).toEqual([
    { id: 1, title: 'Pyramids' },
    { id: 2, title: 'Tower Bridge' },
  ] as Holiday[]);
});
