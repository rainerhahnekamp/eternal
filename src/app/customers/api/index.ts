import { inject, Injectable, Signal } from '@angular/core';
import { Customer } from '@app/customers/model';
import { CustomersStore } from '@app/customers/data';

@Injectable({ providedIn: 'root' })
export class Customers {
  #customersStore = inject(CustomersStore);
  get selectedCustomer(): Signal<Customer | undefined> {
    return this.#customersStore.selectedCustomer;
  }
}
