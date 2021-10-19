import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { FormlyMatDatepickerModule } from '@ngx-formly/material/datepicker';
import { formly } from 'ngx-formly-helpers';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { CustomerActions } from '../+state/customer.actions';
import { CustomerAppState } from '../+state/customer.reducer';
import { fromCustomer } from '../+state/customer.selectors';
import { countries } from '../countries';
import { Customer } from '../customer';

@Component({
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent {
  formGroup = new FormGroup({});
  customer$: Observable<Customer>;
  fields: FormlyFieldConfig[];

  constructor(private store: Store<CustomerAppState>, private route: ActivatedRoute) {
    this.fields = [
      formly.requiredText('firstname', 'Firstname'),
      formly.requiredText('name', 'Name'),
      formly.requiredSelect('country', 'Country', countries),
      formly.requiredDate('birthdate', 'Birthdate')
    ];
    this.store.dispatch(CustomerActions.load());
    if (this.route.snapshot.data.mode === 'new') {
      this.customer$ = of({
        id: 0,
        firstname: '',
        name: '',
        country: '',
        birthdate: ''
      });
    } else {
      this.customer$ = this.store
        .select(fromCustomer.selectById(Number(this.route.snapshot.params.id)))
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
        this.store.dispatch(CustomerActions.update({ customer }));
      } else {
        this.store.dispatch(CustomerActions.add({ customer }));
      }
    }
  }

  remove(customer: Customer) {
    if (confirm(`Really delete ${customer}?`)) {
      this.store.dispatch(CustomerActions.remove({ customer }));
    }
  }

  private verifyCustomer(customer$: Observable<undefined | Customer>) {
    function customerGuard(customer: undefined | Customer): customer is Customer {
      return customer !== undefined;
    }

    return customer$.pipe(filter(customerGuard));
  }
}

@NgModule({
  declarations: [CustomerComponent],
  exports: [CustomerComponent],
  imports: [
    CommonModule,
    FormlyModule.forChild(),
    FormlyMaterialModule,
    FormlyMatDatepickerModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class CustomerComponentModule {}
