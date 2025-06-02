import { eventGroup } from '@ngrx/signals/events';
import { type } from '@ngrx/signals';
import { Holiday } from '../model/holiday';

export const holidayEvents = eventGroup({
  source: 'Holidays',
  events: {
    load: type<{ query: string; type: string }>(),
    loaded: type<Holiday[]>(),
  },
});
