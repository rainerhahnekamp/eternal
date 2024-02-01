import {
  Component,
  effect,
  EventEmitter,
  inject,
  input,
  Output,
} from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
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
    RouterLinkWithHref,
    NgIf,
    MatInputModule,
    FormErrorsComponent,
    MatSelectModule,
  ],
})
export class CustomerComponent {
  customer = input.required<Customer>();
  countries = input.required<Options>();
  showDeleteButton = input.required<boolean>();
  @Output() save = new EventEmitter<Customer>();
  @Output() remove = new EventEmitter<Customer>();

  constructor() {
    effect(() => {
      this.formGroup.setValue(this.customer());
    });
  }

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
    if (
      this.customer &&
      confirm(
        `Really delete ${this.customer().firstname} ${this.customer().name}?`,
      )
    ) {
      this.remove.emit(this.customer());
    }
  }
}
