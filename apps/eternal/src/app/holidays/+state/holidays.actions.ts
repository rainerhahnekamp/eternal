import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Holiday } from '../model/holiday';

export const holidaysActions = createActionGroup({
  source: 'Holidays',
  events: {
    load: emptyProps(),
    'load success': props<{ holidays: Holiday[] }>(),
    select: props<{ id: number }>(),
    unselect: emptyProps()
  }
});
