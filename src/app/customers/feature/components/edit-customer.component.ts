import {
  Component,
  computed,
  inject,
  input,
  numberAttribute,
} from '@angular/core';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { customersActions } from '../+state/customers.actions';
import { fromCustomers } from '../+state/customers.selectors';
import { AsyncPipe, NgIf } from '@angular/common';
import { CustomerComponent } from '@app/customers/ui';
import { Customer } from '@app/customers/model';
import { selectCountries } from '@app/shared/master-data';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-edit-customer',
  template: `
    @if (data(); as value) {
      <app-customer
        [customer]="value.customer"
        [countries]="value.countries"
        [showDeleteButton]="true"
        (save)="this.submit($event)"
        (remove)="this.remove($event)"
      ></app-customer>
    }
  `,
  standalone: true,
  imports: [CustomerComponent, NgIf, AsyncPipe],
})
export class EditCustomerComponent {
  store = inject(Store);
  id = input.required({ transform: numberAttribute });
  customer = computed(() =>
    this.store.selectSignal(fromCustomers.selectById(this.id()))(),
  );
  countries = this.store.selectSignal(selectCountries);

  data = computed(() => {
    const customer = this.customer();
    const countries = this.countries();

    if (!customer) {
      return;
    }

    return { customer, countries };
  });

  submit(customer: Customer) {
    this.store.dispatch(
      customersActions.update({
        customer: { ...customer, id: this.id() },
      }),
    );
  }

  remove(customer: Customer) {
    this.store.dispatch(
      customersActions.remove({
        customer: { ...customer, id: this.id() },
      }),
    );
  }

  #verifyCustomer(customer$: Observable<undefined | Customer>) {
    function customerGuard(
      customer: undefined | Customer,
    ): customer is Customer {
      return customer !== undefined;
    }

    return customer$.pipe(filter(customerGuard));
  }
}
