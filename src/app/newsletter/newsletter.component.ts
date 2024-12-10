import { Component, computed, effect, inject, signal } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { FormErrorsComponent } from '../shared/form/form-errors.component';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-newsletter',
  template: `<h2>Newsletter</h2>
    <form (ngSubmit)="handleSubmit()" [formGroup]="formGroup">
      <div class="flex flex-col max-w-fit items-center">
        <mat-form-field>
          <mat-label>Address</mat-label>
          <input data-testid="inp-email" formControlName="email" matInput />
          <mat-icon matSuffix>location_on</mat-icon>
          <mat-hint>Please enter your email</mat-hint>
        </mat-form-field>
        <app-form-errors [control]="formGroup.controls.email" />
        <button mat-raised-button data-testid="btn-subscribe" class="my-4">
          Subscribe
        </button>
      </div>
    </form>
    <p>{{ city() }}</p>
    <p>{{ state() | json }}</p>
    <!--    <p data-testid="p-message">{{ message() }}</p>--> `,
  imports: [
    ReactiveFormsModule,
    MatLabel,
    MatHint,
    MatFormField,
    MatInput,
    MatIcon,
    MatButton,
    FormErrorsComponent,
    JsonPipe,
  ],
})
export class NewsletterComponent {
  isFormValid = signal(false);
  message = computed(() => {
    console.log('executing computed...');
    return this.isFormValid() ? 'Form is valid' : 'Form is invalid';
  });

  constructor() {
    effect(() => console.log(this.isFormValid()));
  }

  formGroup = inject(NonNullableFormBuilder).group({
    email: ['', Validators.required],
  });

  state = signal({
    id: 1,
    name: 'Konrad',
    location: {
      city: 'Silkeborg',
      country: 'Denmark',
    },
  });

  city = computed(() => this.state().location.city);

  handleSubmit() {
    this.state.update((value) => {
      value.location = { ...value.location, city: 'Aarhus' };
      return value;
    });
  }
}
