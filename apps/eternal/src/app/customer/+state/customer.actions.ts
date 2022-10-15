import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Customer } from '../customer';

export const customerActions = createActionGroup({
  source: 'Customer',
  events: {
    load: emptyProps(),
    loaded: props<{ customers: Customer[]; pageCount: number }>(),
    add: props<{ customer: Customer }>(),
    added: props<{ customer: Customer }>(),
    update: props<{ customer: Customer }>(),
    updated: props<{ customer: Customer }>(),
    remove: props<{ customer: Customer }>(),
    removed: props<{ customer: Customer }>(),
    'next page': emptyProps(),
    'next page success': props<{ customers: Customer[] }>(),
    'previous page': emptyProps(),
    'previous page success': props<{ customers: Customer[] }>()
  }
});
