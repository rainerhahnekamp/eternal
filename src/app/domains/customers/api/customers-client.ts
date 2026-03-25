import { inject, Injectable, Signal } from '@angular/core';
import { Customer } from '../model/customer';
import { CustomerStore } from '../data/customer-store';

@Injectable({ providedIn: 'root' })
export class CustomersClient {
  #customersStore = inject(CustomerStore);
  get selectedCustomer(): Signal<Customer | undefined> {
    return this.#customersStore.selectedCustomer;
  }
}
