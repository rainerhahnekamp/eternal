import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { CustomerView } from '../../ui/customer/customer-view';
import { Customer } from '../../model/customer';
import { selectCountries } from '../../../../shared/master-data/master.reducer';
import { CustomerStore } from '../../data/customer-store';
// ✅
import { CustomersApi } from '../api/customers-api';
// ✅
import { CustomersStore } from '../data/store';
// ✅
import { model } from '../model/model';
// ✅
import { UI } from '../ui/ui';
// ✅
import { CustomersClient } from '../../api/customers-client';

const api = CustomersApi
const data = CustomersStore
const m = model
const ui = UI
const client = CustomersClient

@Component({
  selector: 'app-add-customer',
  template: ` <app-customer
    [customer]="customer"
    [countries]="countries()"
    (save)="submit($event)"
    [showDeleteButton]="false"
  ></app-customer>`,
  imports: [CustomerView],
})
export class AddCustomerPage {
  readonly #customerStore = inject(CustomerStore);
  readonly #store = inject(Store);

  customer: Customer = {
    id: 0,
    firstname: '',
    name: '',
    country: '',
    birthdate: '',
  };

  protected countries = this.#store.selectSignal(selectCountries);

  submit(customer: Customer) {
    this.#customerStore.add(customer);
  }
}
