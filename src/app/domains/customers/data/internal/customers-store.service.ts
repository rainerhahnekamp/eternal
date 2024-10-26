import { inject, Injectable, Signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { customersActions } from './customers.actions';
import { Customer } from '../../model/customer';
import { fromCustomers } from './customers.selectors';

@Injectable({ providedIn: 'root' })
export class CustomersStore {
  #store = inject(Store);

  load(page: number) {
    this.#store.dispatch(customersActions.load({ page }));
  }

  add(customer: Customer) {
    this.#store.dispatch(customersActions.add({ customer }));
  }

  update(customer: Customer) {
    this.#store.dispatch(customersActions.update({ customer }));
  }

  remove(id: number) {
    this.#store.dispatch(customersActions.remove({ id }));
  }

  select(id: number) {
    this.#store.dispatch(customersActions.select({ id }));
  }

  unselect() {
    this.#store.dispatch(customersActions.unselect());
  }

  findById(id: number): Signal<Customer | undefined> {
    return this.#store.selectSignal(fromCustomers.selectById(id));
  }

  get pagedCustomers() {
    return this.#store.selectSignal(fromCustomers.selectPagedCustomers);
  }

  get selectedCustomer(): Signal<Customer | undefined> {
    return this.#store.selectSignal(fromCustomers.selectSelectedCustomer);
  }
}
