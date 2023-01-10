import { Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { formly } from 'ngx-formly-helpers';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { customerActions } from '../+state/customer.actions';
import { fromCustomer } from '../+state/customer.selectors';
import { countries } from '../countries';
import { Customer } from '../customer';
import { AsyncPipe, NgIf } from '@angular/common';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { FormlyMatDatepickerModule } from '@ngx-formly/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TestidDirective } from '../../shared/testid.directive';

@Component({
  selector: 'eternal-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
  standalone: true,
  imports: [
    FormlyModule,
    FormlyMaterialModule,
    FormlyMatDatepickerModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDatepickerModule,
    RouterLink,
    AsyncPipe,
    NgIf,
    TestidDirective
  ]
})
export class CustomerComponent {
  formGroup = new FormGroup({});
  customer$: Observable<Customer>;
  #store = inject(Store);
  #route = inject(ActivatedRoute);

  fields: FormlyFieldConfig[] = [
    formly.requiredText('firstname', 'Firstname', {
      attributes: { 'data-testid': 'inp-firstname' }
    }),
    formly.requiredText('name', 'Name', { attributes: { 'data-testid': 'inp-name' } }),
    (() => {
      const fieldConfig = formly.requiredSelect('country', 'Country', countries);
      if (fieldConfig.templateOptions) {
        fieldConfig.templateOptions.attributes = { 'data-testid': 'sel-country' };
      }
      return fieldConfig;
    })(),
    formly.requiredDate('birthdate', 'Birthdate', {
      attributes: { 'data-testid': 'date-birthdate' }
    })
  ];

  constructor() {
    this.#store.dispatch(customerActions.load());
    if (this.#route.snapshot.data['mode'] === 'new') {
      this.customer$ = of({
        id: 0,
        firstname: '',
        name: '',
        country: '',
        birthdate: ''
      });
    } else {
      this.customer$ = this.#store
        .select(fromCustomer.selectById(Number(this.#route.snapshot.params['id'])))
        .pipe(
          filter((customer) => !!customer),
          this.verifyCustomer,
          map((customer) => ({ ...customer }))
        );
    }
  }

  submit(customer: Customer) {
    if (this.formGroup.valid) {
      if (customer.id) {
        this.#store.dispatch(customerActions.update({ customer }));
      } else {
        this.#store.dispatch(customerActions.add({ customer }));
      }
    }
  }

  remove(customer: Customer) {
    if (confirm(`Really delete ${customer}?`)) {
      this.#store.dispatch(customerActions.remove({ customer }));
    }
  }

  private verifyCustomer(customer$: Observable<undefined | Customer>) {
    function customerGuard(customer: undefined | Customer): customer is Customer {
      return customer !== undefined;
    }

    return customer$.pipe(filter(customerGuard));
  }
}
