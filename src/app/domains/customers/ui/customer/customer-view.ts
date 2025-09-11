import { Component, effect, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { RouterLinkWithHref } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Customer } from '../../model/customer';
import { SelectOptions } from '../../../../shared/form/select-options';
import { assertDefined } from '../../../../shared/util/assert-defined';
// ✅
import { CustomersApi } from '../../feature/api/customers-api';
// ✅
import { CustomersStore } from '../../feature/data/store';
// ✅
import { CustomersClient } from '../../api/customers-client';
// ✅
import { CustomerStore } from '../../data/customer-store';

const api = CustomersApi
const data = CustomersStore
const client = CustomersClient
const domainData = CustomerStore
@Component({
  selector: 'app-customer',
  templateUrl: './customer-view.html',
  styleUrls: ['./customer-view.scss'],
  imports: [
    MatButtonModule,
    MatDatepickerModule,
    RouterLinkWithHref,
    MatInputModule,
    MatSelectModule,
    FormsModule,
  ],
})
export class CustomerView {
  customer = input.required<Customer>();

  formCustomer: Customer | undefined;
  #formCustomerSync = effect(
    () => (this.formCustomer = { ...this.customer() }),
  );

  countries = input.required<SelectOptions>();
  showDeleteButton = input.required<boolean>();
  save = output<Customer>();
  remove = output<Customer>();

  submit() {
    assertDefined(this.formCustomer);
    this.save.emit(this.formCustomer);
  }

  handleRemove() {
    assertDefined(this.formCustomer);
    const { firstname, name } = this.formCustomer;
    if (confirm(`Really delete ${firstname} ${name}?`)) {
      this.remove.emit(this.formCustomer);
    }
  }
}
