import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { CustomerComponent } from '@app/customers/ui';
import { Customer } from '@app/customers/model';
import { selectCountries } from '@app/shared/master-data';
import { CustomersStore } from '@app/customers/data';

@Component({
  selector: 'app-add-customer',
  template: ` <app-customer
    [customer]="customer"
    [countries]="countries()"
    (save)="submit($event)"
    [showDeleteButton]="false"
  ></app-customer>`,
  standalone: true,
  imports: [CustomerComponent],
})
export class AddCustomerComponent {
  #customersFacade = inject(CustomersStore);
  #store = inject(Store);

  customer: Customer = {
    id: 0,
    firstname: '',
    name: '',
    country: '',
    birthdate: '',
  };

  protected countries = this.#store.selectSignal(selectCountries);

  submit(customer: Customer) {
    this.#customersFacade.add(customer);
  }
}
