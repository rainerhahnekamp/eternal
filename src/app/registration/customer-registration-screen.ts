import {
  ChangeDetectionStrategy,
  Component,
  inject,
  linkedSignal,
} from '@angular/core';
import {
  email,
  Field,
  form,
  minLength,
  required,
} from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { validateSameValue } from '../shared/form/validate-same-value';
import { RegistrationStore } from './registration-store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-registration',
  template: `
    <div class="p-8 w-full max-w-md">
      <h1 class="text-2xl font-bold mb-6 text-center text-gray-800">
        Customer Registration
      </h1>
      <div class="flex flex-col gap-4" disabled>
        <div class="grid grid-cols-2 gap-4">
          <mat-form-field class="w-full" disabled>
            <mat-label>First Name</mat-label>
            <input
              type="text"
              matInput
              [field]="customerForm.firstname"
              placeholder="Enter your first name"
            />
            <mat-icon matPrefix>person</mat-icon>
            <mat-hint>Your given name</mat-hint>
            @for (
              error of customerForm.firstname().errors();
              track error.message
            ) {
              <mat-error>{{ error.message }}</mat-error>
            }
          </mat-form-field>

          <mat-form-field class="w-full" disabled>
            <mat-label>Last Name</mat-label>
            <input
              type="text"
              matInput
              [field]="customerForm.name"
              placeholder="Enter your last name"
            />
            <mat-icon matPrefix>badge</mat-icon>
            <mat-hint>Your family name</mat-hint>
            @for (error of customerForm.name().errors(); track error.message) {
              <mat-error>{{ error.message }}</mat-error>
            }
          </mat-form-field>
        </div>

        <mat-form-field class="w-full" disabled>
          <mat-label>Email Address</mat-label>
          <input
            type="email"
            matInput
            [field]="customerForm.email"
            placeholder="example@domain.com"
          />
          <mat-icon matPrefix>email</mat-icon>
          <mat-hint>We'll never share your email</mat-hint>
          @for (error of customerForm.email().errors(); track error.message) {
            <mat-error>{{ error.message }}</mat-error>
          }
        </mat-form-field>

        <div class="grid grid-cols-2 gap-4">
          <mat-form-field class="w-full" disabled>
            <mat-label>Password</mat-label>
            <input
              type="password"
              matInput
              [field]="customerForm.password"
              placeholder="Create a secure password"
            />
            <mat-icon matPrefix>lock</mat-icon>
            <mat-hint>At least 8 characters recommended</mat-hint>
            @for (
              error of customerForm.password().errors();
              track error.message
            ) {
              <mat-error>{{ error.message }}</mat-error>
            }
          </mat-form-field>

          <mat-form-field class="w-full" disabled>
            <mat-label>Confirm Password</mat-label>
            <input
              type="password"
              matInput
              [field]="customerForm.passwordConfirmation"
              placeholder="Re-enter your password"
            />
            <mat-icon matPrefix>lock_outline</mat-icon>
            @for (
              error of customerForm.passwordConfirmation().errors();
              track error.message
            ) {
              <mat-error>{{ error.message }}</mat-error>
            }
          </mat-form-field>
        </div>

        <div class="flex justify-end gap-4 mt-4">
          <button mat-button type="button" class="px-8 py-2">Back</button>
          <button
            mat-raised-button
            color="primary"
            [class]="{
              'px-8': true,
              'py-2': true,
              invisible: customerForm().invalid(),
            }"
            (click)="continue()"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Field,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButton,
  ],
})
export class CustomerRegistrationScreen {
  readonly #registrationStore = inject(RegistrationStore);
  readonly #router = inject(Router);

  readonly formData = linkedSignal(this.#registrationStore.customer);

  readonly customerForm = form(this.formData, (path) => {
    required(path.firstname, { message: 'First name is required' });
    required(path.name, { message: 'Last name is required' });
    email(path.email, { message: 'Invalid email address' });
    minLength(path.password, 8, {
      message: 'Password must be at least 8 characters long',
    });

    validateSameValue(
      path.password,
      path.passwordConfirmation,
      'Passwords do not match',
    );
  });

  protected continue() {
    this.#router.navigate(['/registration/address']);
  }
}
