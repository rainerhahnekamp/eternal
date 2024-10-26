import { inject, Injectable, Signal } from '@angular/core';
import { CustomersStore } from '../data/provide-customer';
import { Customer } from '../model/customer';

@Injectable({ providedIn: 'root' })
export class Customers {
  #customersStore = inject(CustomersStore);
  get selectedCustomer(): Signal<Customer | undefined> {
    return this.#customersStore.selectedCustomer;
  }
}
