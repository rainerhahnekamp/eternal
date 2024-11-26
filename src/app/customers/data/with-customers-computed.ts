import { signalStoreFeature, type, withComputed } from '@ngrx/signals';
import { computed, Signal } from '@angular/core';
import { Customer } from '../model';

export function withCustomersComputed<_>() {
  return signalStoreFeature(
    {
      state: type<{
        _selectedId: number | undefined;
        page: number;
        total: number;
      }>(),
      computed: type<{ entities: Signal<Customer[]> }>(),
    },
    withComputed(({ entities, _selectedId, page, total }) => ({
      pagedCustomers: computed(() => {
        return {
          customers: entities().map((customer) => ({
            ...customer,
            selected: customer.id === _selectedId(),
          })),
          page: page(),
          total: total(),
        };
      }),
      selectedCustomer: computed(() => {
        return entities().find((customer) => customer.id === _selectedId());
      }),
    })),
  );
}
