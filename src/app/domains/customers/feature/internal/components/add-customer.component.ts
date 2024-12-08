import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { CustomerComponent } from '../../../ui/customer/customer.component';
import { Customer } from '../../../model/customer';
import { selectCountries } from '../../../../../shared/master-data/master.reducer';
import { CustomerStore } from '../../../data/customer-store.service';

@Component({
  selector: 'app-add-customer',
  template: ` <app-customer
    [customer]="customer"
    [countries]="countries()"
    (save)="submit($event)"
    [showDeleteButton]="false"
  ></app-customer>`,
  imports: [CustomerComponent],
})
export class AddCustomerComponent {
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
