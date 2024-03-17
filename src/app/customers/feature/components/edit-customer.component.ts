import {
  Component,
  computed,
  effect,
  inject,
  input,
  numberAttribute,
} from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { CustomerComponent } from '@app/customers/ui';
import { Customer } from '@app/customers/model';
import { selectCountries } from '@app/shared/master-data';
import { Store } from '@ngrx/store';
import { CustomersStore } from '@app/customers/data';

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
  standalone: true,
  imports: [CustomerComponent, NgIf, AsyncPipe],
})
export class EditCustomerComponent {
  store = inject(Store);
  #customersFacade = inject(CustomersStore);

  id = input.required({ transform: numberAttribute });
  countries = this.store.selectSignal(selectCountries);

  data = computed(() => {
    const customer = this.#customersFacade.selectedCustomer();
    const countries = this.countries();

    if (!customer) {
      return;
    }

    return { customer, countries };
  });

  constructor() {
    effect(() => {
      const id = this.id();

      this.#customersFacade.select(id);
    });
  }

  submit(customer: Customer) {
    this.#customersFacade.update({ ...customer, id: this.id() });
  }

  remove() {
    this.#customersFacade.remove(this.id());
  }
}
