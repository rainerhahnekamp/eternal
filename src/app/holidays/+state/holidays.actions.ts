import { createAction } from '@ngrx/store';

const findHolidays = createAction('[Holidays] Find');
const findHolidaysSuccess = createAction('[Holidays] Find Success');

export const holidaysActions = {
  findHolidays,
  findHolidaysSuccess
};
