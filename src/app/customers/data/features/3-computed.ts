import { signalStoreFeature, withComputed } from '@ngrx/signals';
import { withFeatureCrud } from './2-crud';
import { computed } from '@angular/core';

export function withFeatureComputed() {
  return signalStoreFeature(
    withFeatureCrud(),
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
