import { Component, inject, signal, Signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { AsyncPipe, NgIf } from '@angular/common';
import { CustomerComponent } from '@app/customers/ui';
import { Customer } from '@app/customers/model';
import { Options } from '@app/shared/form';
import { selectCountries } from '@app/shared/master-data';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { CustomersStore } from '@app/customers/data';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-edit-customer',
  template: `
    @if (data(); as value) {
      <app-customer
        [customer]="value.customer"
        [countries]="value.countries"
        (save)="this.submit($event)"
        (remove)="this.remove($event)"
        [showSubmitButton]="showSubmitButton()"
      ></app-customer>
    }
  `,
  standalone: true,
  imports: [CustomerComponent, NgIf, AsyncPipe],
})
export class EditCustomerComponent {
  showSubmitButton = signal(true);
  data: Signal<{ customer: Customer; countries: Options } | undefined>;
  customerId = 0;
  customersStore = inject(CustomersStore);

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    const countries$: Observable<Options> = this.store.select(selectCountries);
    const customer$ = toObservable(
      this.customersStore.findById(
        Number(this.route.snapshot.paramMap.get('id') || ''),
      ),
    ).pipe(
      this.#verifyCustomer,
      map((customer) => {
        this.customerId = customer.id;
        return { ...customer };
      }),
    );

    this.data = toSignal(
      combineLatest({
        countries: countries$,
        customer: customer$,
      }).pipe(map(({ countries, customer }) => ({ countries, customer }))),
    );
  }

  submit(customer: Customer) {
    const urlTree = this.router.createUrlTree(['..'], {
      relativeTo: this.route,
    });
    this.showSubmitButton.set(false);
    this.customersStore.update(
      { ...customer, id: this.customerId },
      urlTree.toString(),
      'Customer has been updated',
      () => this.showSubmitButton.set(true),
    );
  }

  remove(customer: Customer) {
    this.customersStore.remove({ ...customer, id: this.customerId });
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
