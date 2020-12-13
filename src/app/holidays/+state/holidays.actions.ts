import { createAction, props } from '@ngrx/store';
import { Holiday } from '../holiday';

const findHolidays = createAction('[Holidays] Find');
const findHolidaysSuccess = createAction(
  '[Holidays] Find Success',
  props<{ holidays: Holiday[] }>()
);

export const holidaysActions = {
  findHolidays,
  findHolidaysSuccess,
};
