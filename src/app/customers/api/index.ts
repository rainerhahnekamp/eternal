import { inject, Injectable, Signal } from '@angular/core';
import { CustomersStore } from '@app/customers/data/customers-store.service';
import { Customer } from '@app/customers/model';

@Injectable({ providedIn: 'root' })
export class Customers {
  #customersStore = inject(CustomersStore);
  get selectedCustomer(): Signal<Customer | undefined> {
    return this.#customersStore.selectedCustomer;
  }
}
