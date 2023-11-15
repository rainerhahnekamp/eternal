import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CustomerComponent } from '@app/customers/ui';
import { Customer } from '@app/customers/model';
import { selectCountries } from '@app/shared/master-data';
import { CustomersRepository } from '@app/customers/data';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-add-customer',
  template: ` <app-customer
    [customer]="customer"
    [countries]="countries()"
    (save)="submit($event)"
    [showDeleteButton]="false"
  ></app-customer>`,
  standalone: true,
  imports: [CustomerComponent, NgIf, AsyncPipe],
})
export class AddCustomerComponent {
  #store = inject(Store);
  #repo = inject(CustomersRepository);
  customer: Customer = {
    id: 0,
    firstname: '',
    name: '',
    country: '',
    birthdate: '',
  };
  protected countries = this.#store.selectSignal(selectCountries);

  submit(customer: Customer) {
    this.#repo.add({ ...customer, id: 0 });
  }
}
