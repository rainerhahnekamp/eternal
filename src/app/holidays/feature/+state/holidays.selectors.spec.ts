import { fromHolidays } from './holidays.selectors';
import { createHolidays } from '@app/holidays/model';
import { createState } from '@app/holidays/feature/+state/test-utils';

it('should select the holidays', () => {
  const holidays = createHolidays(
    { id: 1, title: 'Pyramids' },
    { id: 2, title: 'Tower Bridge' },
  );
  const state = createState({
    holidays,
  });

  expect(fromHolidays.get.projector(state)).toBe(holidays);
});
