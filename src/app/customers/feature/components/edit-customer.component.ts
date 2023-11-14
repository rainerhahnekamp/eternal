import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { customersActions } from '../+state/customers.actions';
import { fromCustomers } from '../+state/customers.selectors';
import { AsyncPipe, NgIf } from '@angular/common';
import { CustomerComponent } from '@app/customers/ui';
import { Customer } from '@app/customers/model';
import { Options } from '@app/shared/form';
import { selectCountries } from '@app/shared/master-data';

@Component({
  selector: 'app-edit-customer',
  template: ` <app-customer
    *ngIf="data$ | async as data"
    [customer]="data.customer"
    [countries]="data.countries"
    (save)="this.submit($event)"
    (remove)="this.remove($event)"
  ></app-customer>`,
  standalone: true,
  imports: [CustomerComponent, NgIf, AsyncPipe],
})
export class EditCustomerComponent {
  data$: Observable<{ customer: Customer; countries: Options }>;
  customerId = 0;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
  ) {
    const countries$: Observable<Options> = this.store.select(selectCountries);
    const customer$ = this.store
      .select(
        fromCustomers.selectById(
          Number(this.route.snapshot.paramMap.get('id') || ''),
        ),
      )
      .pipe(
        this.#verifyCustomer,
        map((customer) => {
          this.customerId = customer.id;
          return { ...customer };
        }),
      );

    this.data$ = combineLatest({
      countries: countries$,
      customer: customer$,
    }).pipe(map(({ countries, customer }) => ({ countries, customer })));
  }

  submit(customer: Customer) {
    this.store.dispatch(
      customersActions.update({
        customer: { ...customer, id: this.customerId },
      }),
    );
  }

  remove(customer: Customer) {
    this.store.dispatch(
      customersActions.remove({
        customer: { ...customer, id: this.customerId },
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
