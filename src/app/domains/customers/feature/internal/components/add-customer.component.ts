import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { CustomerComponent } from '../../../ui/customer/customer.component';
import { CustomersStore } from '../../../data/provide-customer';
import { Customer } from '../../../model/customer';
import { selectCountries } from '../../../../../shared/master-data/master.reducer';

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
