import { fromHolidays } from '@app/holidays/data/holidays.selectors';
import { HolidaysState } from '@app/holidays/data/holidays.reducer';
import { createHoliday } from '@app/holidays/model';

it('should verify the selector', () => {
  const holiday1 = createHoliday({ id: 1 });
  const holiday2 = createHoliday({ id: 2 });
  const state: HolidaysState = {
    holidays: [holiday1, holiday2],
    loadStatus: 'loaded',
    favouriteIds: [1],
  };

  const holidaysWithSelected =
    fromHolidays.selectHolidaysWithFavourite.projector(
      state.holidays,
      state.favouriteIds,
    );

  expect(holidaysWithSelected).toEqual([
    { ...holiday1, isFavourite: true },
    { ...holiday2, isFavourite: false },
  ]);
});
