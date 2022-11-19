import { holidaysActions as allHolidaysActions } from './lib/holidays.actions';

export { holidaysDataProvider } from './lib/holidays-data.provider';
const { get, addFavourite, removeFavourite } = allHolidaysActions;
export const holidaysActions = { get, addFavourite, removeFavourite };
export { fromHolidays } from './lib/holidays.selectors';
