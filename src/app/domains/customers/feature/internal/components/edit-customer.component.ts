import {
  Component,
  computed,
  inject,
  input,
  numberAttribute,
} from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { Store } from '@ngrx/store';
import { CustomerComponent } from '../../../ui/customer/customer.component';
import { Customer } from '../../../model/customer';
import { selectCountries } from '../../../../../shared/master-data/master.reducer';
import { CustomerStore } from '../../../data/customer-store.service';

@Component({
  selector: 'app-edit-customer',
  template: `
    @if (data(); as value) {
      <app-customer
        [customer]="value.customer"
        [countries]="value.countries"
        [showDeleteButton]="true"
        (save)="this.submit($event)"
        (remove)="this.remove()"
      ></app-customer>
    }
  `,
  imports: [CustomerComponent, NgIf, AsyncPipe],
})
export class EditCustomerComponent {
  readonly #store = inject(Store);
  readonly #customerStore = inject(CustomerStore);

  readonly id = input.required({ transform: numberAttribute });
  readonly countries = this.#store.selectSignal(selectCountries);

  readonly data = computed(() => {
    const customer = this.#customerStore.selectedCustomer();
    const countries = this.countries();

    if (!customer) {
      return;
    }

    return { customer, countries };
  });

  constructor() {
    this.#customerStore.select(this.id);
  }

  submit(customer: Customer) {
    this.#customerStore.update({ ...customer, id: this.id() });
  }

  remove() {
    this.#customerStore.remove(this.id());
  }
}
