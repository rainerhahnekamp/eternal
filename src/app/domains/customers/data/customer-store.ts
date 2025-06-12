import { computed } from '@angular/core';
import { signalStore, withComputed, withState } from '@ngrx/signals';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';
import { on, withReducer } from '@ngrx/signals/events';
import { Customer } from '../model/customer';
import { withCustomerEffects } from './customer-effects';
import { customerEvents } from './customer-events';

export interface CustomerState {
  page: number;
  total: number;
  selectedId: number | undefined;
  status: 'init' | 'loading' | 'loaded';
}

const initialState: CustomerState = {
  page: 0,
  total: 0,
  selectedId: undefined,
  status: 'init',
};

export const CustomerStore = signalStore(
  { providedIn: 'root' },
  withEntities<Customer>(),
  withState(initialState),
  withCustomerEffects(),
  withReducer(
    on(
      customerEvents.loadSuccess,
      ({ payload: { customers, total, page } }) => [
        setAllEntities(customers),
        { total, page, status: 'loaded' as const },
      ],
    ),
    on(customerEvents.select, ({ payload: selectedId }) => ({ selectedId })),
    on(customerEvents.unselect, () => ({ selectedId: undefined })),
  ),
  withComputed((state) => ({
    selectedCustomer: computed(() =>
      state.entities().find((customer) => customer.id === state.selectedId()),
    ),
    pagedCustomer: computed(() => ({
      customers: state.entities().map((customer) => ({
        ...customer,
        selected: customer.id === state.selectedId(),
      })),
      pageIndex: state.page(),
      length: state.total(),
    })),
  })),
);
