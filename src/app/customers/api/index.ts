import { inject, Injectable, Signal } from '@angular/core';
import { Customer } from '@app/customers/model';
import { CustomersRepository } from '@app/customers/data';

@Injectable({
  providedIn: 'root',
})
export class CustomersApi {
  #repo = inject(CustomersRepository);
  get selectedCustomer(): Signal<Customer | undefined> {
    return this.#repo.selectedCustomer;
  }
}
