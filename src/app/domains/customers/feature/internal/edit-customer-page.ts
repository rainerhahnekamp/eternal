import {
  Component,
  computed,
  effect,
  inject,
  input,
  numberAttribute,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { CustomerView } from '../../ui/customer/customer-view';
import { Customer } from '../../model/customer';
import { selectCountries } from '../../../../shared/master-data/master.reducer';
import { CustomerStore } from '../../data/customer-store';
import { injectCustomerEvents } from '../../data/customer-events';

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
  imports: [CustomerView],
})
export class EditCustomerPage {
  readonly #store = inject(Store);
  readonly #customerStore = inject(CustomerStore);
  readonly #events = injectCustomerEvents();

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
    effect(() => this.#events.select(this.id()));
  }

  submit(customer: Customer) {
    this.#events.update({ ...customer, id: this.id() });
  }

  remove() {
    this.#events.remove(this.id());
  }
}
