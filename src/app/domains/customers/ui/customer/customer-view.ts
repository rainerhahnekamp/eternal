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

  constructor() {
    effect(() => (this.formCustomer = { ...this.customer() }), {
      debugName: 'formCustomerSync',
    });
  }

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
