import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { RouterLinkWithHref } from '@angular/router';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { FormErrorsComponent, Options } from '@app/shared/form';
import { Customer } from '@app/customers/model';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    RouterLinkWithHref,
    NgIf,
    MatInputModule,
    FormErrorsComponent,
    MatSelectModule,
  ],
})
export class CustomerComponent {
  @Input() customer: Customer | undefined;
  @Input() countries: Options = [];
  @Input() showDeleteButton = true;
  @Output() save = new EventEmitter<Customer>();
  @Output() remove = new EventEmitter<Customer>();

  formGroup = inject(NonNullableFormBuilder).group({
    id: [0],
    firstname: ['', [Validators.required]],
    name: ['', [Validators.required]],
    country: ['', [Validators.required]],
    birthdate: ['', [Validators.required]],
  });
  submit() {
    if (this.formGroup.valid) {
      this.save.emit(this.formGroup.getRawValue());
    }
  }

  handleRemove() {
    if (this.customer && confirm(`Really delete ${this.customer}?`)) {
      this.remove.emit(this.customer);
    }
  }
}
