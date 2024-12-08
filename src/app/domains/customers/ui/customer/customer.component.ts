import { Component, input, linkedSignal, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { RouterLinkWithHref } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Customer } from '../../model/customer';
import { SelectOptions } from '../../../../shared/form/select-options';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
  imports: [
    MatButtonModule,
    MatDatepickerModule,
    RouterLinkWithHref,
    MatInputModule,
    MatSelectModule,
    FormsModule,
  ],
})
export class CustomerComponent {
  customer = input.required<Customer>(); // original
  formCustomer = linkedSignal(this.customer);

  countries = input.required<SelectOptions>();
  showDeleteButton = input.required<boolean>();
  save = output<Customer>();
  remove = output<Customer>();

  submit() {
    this.save.emit(this.formCustomer());
  }

  handleRemove() {
    const { firstname, name } = this.formCustomer();
    if (confirm(`Really delete ${firstname} ${name}?`)) {
      this.remove.emit(this.formCustomer());
    }
  }
}
