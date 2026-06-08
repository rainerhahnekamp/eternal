import { inject, Service, Signal } from '@angular/core';
import { Customer } from '../model/customer';
import { CustomerStore } from '../data/customer-store';

@Service()
export class CustomersClient {
  #customersStore = inject(CustomerStore);
  get selectedCustomer(): Signal<Customer | undefined> {
    return this.#customersStore.selectedCustomer;
  }
}
