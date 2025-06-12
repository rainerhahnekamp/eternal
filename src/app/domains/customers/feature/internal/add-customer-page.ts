import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { CustomerView } from '../../ui/customer/customer-view';
import { Customer } from '../../model/customer';
import { selectCountries } from '../../../../shared/master-data/master.reducer';
import { injectCustomerEvents } from '../../data/customer-events';

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
  readonly #store = inject(Store);
  readonly #events = injectCustomerEvents();

  customer: Customer = {
    id: 0,
    firstname: '',
    name: '',
    country: '',
    birthdate: '',
  };

  protected countries = this.#store.selectSignal(selectCountries);

  submit(customer: Customer) {
    this.#events.add(customer);
  }
}
