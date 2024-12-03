import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { CustomerComponent } from '@app/customers/ui';
import { Customer } from '@app/customers/model';
import { selectCountries } from '@app/shared/master-data';
import { customersActions } from '@app/customers/feature/+state/customers.actions';

@Component({
    selector: 'app-add-customer',
    template: ` <app-customer
    [customer]="customer"
    [countries]="countries()"
    (save)="submit($event)"
    [showDeleteButton]="false"
  ></app-customer>`,
    imports: [CustomerComponent]
})
export class AddCustomerComponent {
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
    this.#store.dispatch(
      customersActions.add({ customer: { ...customer, id: 0 } }),
    );
  }
}
