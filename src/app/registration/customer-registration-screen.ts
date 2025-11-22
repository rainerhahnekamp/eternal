import {
  ChangeDetectionStrategy,
  Component,
  inject,
  linkedSignal,
} from '@angular/core';
import { RegistrationStore } from './registration-store';
import { required } from '@angular/forms/signals';
import { form } from '@angular/forms/signals';
import { Field } from '@angular/forms/signals';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-customer-registration',
  template: `
    <div class="p-8 w-full max-w-md">
      <h1 class="text-2xl font-bold mb-6 text-center text-gray-800">
        Customer Registration
      </h1>
      <form class="flex flex-col gap-4" disabled>
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
          </mat-form-field>
        </div>

        <div class="flex justify-end gap-4 mt-4">
          <button mat-button type="button" class="px-8 py-2">Back</button>
          <button
            mat-raised-button
            color="primary"
            type="submit"
            class="px-8 py-2"
          >
            Continue
          </button>
        </div>
      </form>
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

  readonly formData = linkedSignal(this.#registrationStore.customer);

  readonly customerForm = form(this.formData, (path) => {
    required(path.firstname);
    required(path.name);
    required(path.email);
    required(path.password);
    required(path.passwordConfirmation);
  });
}
