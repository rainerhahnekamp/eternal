import {
  computed,
  effect,
  inject,
  Injectable,
  signal,
  Signal,
  untracked,
} from '@angular/core';
import { countries } from './customers-root/countries';
import { CustomerService } from '@app/customers/data';
import { Customer } from '@app/customers/model';

@Injectable()
export class CustomerStore {
  readonly #customerService = inject(CustomerService);
  readonly countries = signal(countries).asReadonly();
  readonly #customer = signal<Customer | undefined>(undefined);
  readonly customer = this.#customer.asReadonly();
  readonly fullName = computed(() => {
    const customer = this.#customer();
    return customer ? `${customer.firstname} ${customer.name}` : '';
  });

  loadCustomer(id: Signal<number>) {
    effect(() => {
      const value = id();

      untracked(() => {
        this.#customerService
          .byId(value)
          .then((customer) => this.#customer.set(customer));
      });
    });
  }
}
