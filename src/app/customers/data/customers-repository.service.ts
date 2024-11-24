import { inject, Injectable, Signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { customersActions } from './customers.actions';
import { Customer } from '@app/customers/model';
import { fromCustomers } from '@app/customers/data/customers.selectors';

@Injectable({ providedIn: 'root' })
export class CustomersRepository {
  #store = inject(Store);

  get customers(): Signal<Customer[]> {
    return this.#store.selectSignal(fromCustomers.selectCustomers);
  }

  get pagedCustomers(): Signal<{
    customers: (Customer & { selected: boolean })[];
    total: number;
    page: number;
  }> {
    return this.#store.selectSignal(fromCustomers.selectPagedCustomers);
  }

  get selectedCustomer(): Signal<Customer | undefined> {
    return this.#store.selectSignal(fromCustomers.selectSelectedCustomer);
  }

  get hasError(): Signal<boolean> {
    return this.#store.selectSignal(fromCustomers.selectHasError);
  }

  findById(id: number): Signal<Customer | undefined> {
    return this.#store.selectSignal(fromCustomers.selectById(id));
  }

  init(): void {
    this.#store.dispatch(customersActions.init());
  }

  get(page = 0): void {
    this.#store.dispatch(customersActions.get({ page }));
  }

  add(customer: Customer): void {
    this.#store.dispatch(customersActions.add({ customer }));
  }

  update(
    customer: Customer,
    forward: string,
    message: string,
    callback?: () => void,
  ): void {
    this.#store.dispatch(
      customersActions.update({ customer, forward, message, callback }),
    );
  }

  remove(customer: Customer): void {
    this.#store.dispatch(customersActions.remove({ customer }));
  }

  select(id: number): void {
    this.#store.dispatch(customersActions.select({ id }));
  }

  unselect(): void {
    this.#store.dispatch(customersActions.unselect());
  }
}
