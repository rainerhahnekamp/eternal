import { inject, Injectable, Signal } from '@angular/core';
import { Customer } from '../model/customer';
import { CustomerStore } from '../data/customer-store.service';

@Injectable({ providedIn: 'root' })
export class Customers {
  #customersStore = inject(CustomerStore);
  get selectedCustomer(): Signal<Customer | undefined> {
    return this.#customersStore.selectedCustomer;
  }
}
