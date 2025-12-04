import { eventGroup } from '@ngrx/signals/events';
import { type } from '@ngrx/signals';
import { Customer } from '../model/customer';


export const customerEvents = eventGroup({
  source: '[Events]',
  events: {
    load: type<number>(),
    loaded: type<{ content: Customer[]; total: number }>(),
  },
});
