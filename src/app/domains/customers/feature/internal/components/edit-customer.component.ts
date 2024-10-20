import {
  Component,
  computed,
  effect,
  inject,
  input,
  numberAttribute,
} from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { Store } from '@ngrx/store';
import { CustomerComponent } from '../../../ui/customer/customer.component';
import { CustomersStore } from '../../../data/provide-customer';
import { Customer } from '../../../model/customer';
import { selectCountries } from '../../../../../shared/master-data/master.reducer';

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
