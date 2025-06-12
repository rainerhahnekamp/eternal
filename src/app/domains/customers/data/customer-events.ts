import { type } from '@ngrx/signals';
import { eventGroup, injectDispatch } from '@ngrx/signals/events';
import { Customer } from '../model/customer';

export const customerEvents = eventGroup({
  source: 'Customer',
  events: {
    load: type<{ page: number; callback?: () => void }>(),
    loadSuccess: type<{ customers: Customer[]; total: number; page: number }>(),
    update: type<Customer>(),
    updated: type<void>(),
    remove: type<number>(),
    removed: type<void>(),
    add: type<Customer>(),
    added: type<void>(),
    select: type<number>(),
    unselect: type<void>(),
  },
});

export const injectCustomerEvents = () => injectDispatch(customerEvents);
