import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from '@eternal/customers/model';
import { CustomerComponent } from '@eternal/customers/ui';
import { Options } from '@eternal/shared/form';
import { selectCountries } from '@eternal/shared/master-data';
import { Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';
import { CustomersRepository } from '@eternal/customers/data';

@Component({
  selector: 'eternal-edit-customer',
  template: `<eternal-customer
    *ngIf="data$ | async as data"
    [customer]="data.customer"
    [countries]="data.countries"
    [disableSubmitButton]="disableSubmitButton"
    (save)="this.submit($event)"
    (remove)="this.remove($event)"
  ></eternal-customer>`,
  standalone: true,
  imports: [CustomerComponent, NgIf, AsyncPipe],
})
export class EditCustomerComponent {
  data$: Observable<{ customer: Customer; countries: Options }>;
  customerId: number;
  disableSubmitButton = false;

  constructor(
    private customersRepository: CustomersRepository,
    private store: Store,
    private route: ActivatedRoute,
    private router: Router
  ) {
    const countries$: Observable<Options> = this.store.select(selectCountries);
    this.customerId = Number(this.route.snapshot.paramMap.get('id') || '');
    const customer$ = this.customersRepository.findById(this.customerId);

    this.data$ = combineLatest({
      countries: countries$,
      customer: customer$,
    }).pipe(map(({ countries, customer }) => ({ countries, customer })));
  }

  submit(customer: Customer) {
    const urlTree = this.router.createUrlTree(['..'], {
      relativeTo: this.route,
    });
    this.disableSubmitButton = true;
    this.customersRepository.update(
      { ...customer, id: this.customerId },
      urlTree.toString(),
      'Customer has been updated',
      () => (this.disableSubmitButton = false)
    );
  }

  remove(customer: Customer) {
    this.customersRepository.remove(customer);
  }
}
