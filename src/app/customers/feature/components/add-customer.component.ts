import { Component, inject } from '@angular/core';
import { CustomerComponent } from '@app/customers/ui';
import { Customer } from '@app/customers/model';
import { selectCountries } from '@app/shared/master-data';
import { CustomersStore } from '@app/customers/data';
import { Store } from '@ngrx/store';

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
  #store = inject(Store);
  #customersStore = inject(CustomersStore);
  customer: Customer = {
    id: 0,
    firstname: '',
    name: '',
    country: '',
    birthdate: '',
  };
  protected countries = this.#store.selectSignal(selectCountries);

  submit(customer: Customer) {
    this.#customersStore.add({ ...customer, id: 0 });
  }
}
