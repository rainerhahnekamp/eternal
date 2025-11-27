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
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-address-registration',
  template: `
    <div class="p-8 w-full max-w-4xl">
      <h1 class="text-2xl font-bold mb-6 text-center text-gray-800">
        Address Registration
      </h1>
      <form class="flex flex-col gap-4" disabled>
        <mat-checkbox [field]="addressForm.separateBillingAddress" disabled>
          Billing address is different from shipping address
        </mat-checkbox>

        <div
          class="grid gap-6"
          [class.grid-cols-1]="!addressForm.separateBillingAddress()"
          [class.grid-cols-2]="addressForm.separateBillingAddress()"
        >
          <!-- Shipping Address Column -->
          <div class="flex flex-col gap-4">
            <h2 class="text-lg font-semibold mb-2">Shipping Address</h2>
            <div class="grid grid-cols-3 gap-4">
              <mat-form-field class="w-full col-span-2" disabled>
                <mat-label>Street</mat-label>
                <input
                  type="text"
                  matInput
                  [field]="addressForm.street"
                  placeholder="Enter street name"
                />
                <mat-hint>Street name</mat-hint>
              </mat-form-field>

              <mat-form-field class="w-full" disabled>
                <mat-label>Street Number</mat-label>
                <input
                  type="text"
                  matInput
                  [field]="addressForm.streetNumber"
                  placeholder="No."
                />
                <mat-hint>Number</mat-hint>
              </mat-form-field>
            </div>

            <div class="grid grid-cols-3 gap-4">
              <mat-form-field class="w-full" disabled>
                <mat-label>ZIP Code</mat-label>
                <input
                  type="text"
                  matInput
                  [field]="addressForm.zip"
                  placeholder="12345"
                />
                <mat-hint>Postal code</mat-hint>
              </mat-form-field>

              <mat-form-field class="w-full col-span-2" disabled>
                <mat-label>City</mat-label>
                <input
                  type="text"
                  matInput
                  [field]="addressForm.city"
                  placeholder="Enter city name"
                />
                <mat-icon matPrefix>location_city</mat-icon>
                <mat-hint>City name</mat-hint>
              </mat-form-field>
            </div>

            <mat-form-field class="w-full" disabled>
              <mat-label>Country</mat-label>
              <input
                type="text"
                matInput
                [field]="addressForm.country"
                placeholder="Enter country name"
              />
              <mat-icon matPrefix>public</mat-icon>
              <mat-hint>Country name</mat-hint>
            </mat-form-field>
          </div>

          <!-- Billing Address Column -->
          @let billingAddress = addressForm.billingAddress;
          @if (addressForm.separateBillingAddress().value()) {
            <div class="flex flex-col gap-4">
              <h2 class="text-lg font-semibold mb-2">Billing Address</h2>
              <div class="grid grid-cols-3 gap-4">
                <mat-form-field class="w-full col-span-2" disabled>
                  <mat-label>Street</mat-label>
                  <input
                    type="text"
                    matInput
                    [field]="billingAddress.street"
                    placeholder="Enter street name"
                  />
                  <mat-hint>Street name</mat-hint>
                </mat-form-field>

                <mat-form-field class="w-full" disabled>
                  <mat-label>Street Number</mat-label>
                  <input
                    type="text"
                    matInput
                    [field]="billingAddress.streetNumber"
                    placeholder="No."
                  />
                  <mat-hint>Number</mat-hint>
                </mat-form-field>
              </div>

              <div class="grid grid-cols-3 gap-4">
                <mat-form-field class="w-full" disabled>
                  <mat-label>ZIP Code</mat-label>
                  <input
                    type="text"
                    matInput
                    [field]="billingAddress.zip"
                    placeholder="12345"
                  />
                  <mat-hint>Postal code</mat-hint>
                </mat-form-field>

                <mat-form-field class="w-full col-span-2" disabled>
                  <mat-label>City</mat-label>
                  <input
                    type="text"
                    matInput
                    [field]="billingAddress.city"
                    placeholder="Enter city name"
                  />
                  <mat-icon matPrefix>location_city</mat-icon>
                  <mat-hint>City name</mat-hint>
                </mat-form-field>
              </div>

              <mat-form-field class="w-full" disabled>
                <mat-label>Country</mat-label>
                <input
                  type="text"
                  matInput
                  [field]="billingAddress.country"
                  placeholder="Enter country name"
                />
                <mat-icon matPrefix>public</mat-icon>
                <mat-hint>Country name</mat-hint>
              </mat-form-field>

              <mat-form-field class="w-full" disabled>
                <mat-label>VAT Number</mat-label>
                <input
                  type="text"
                  matInput
                  [field]="billingAddress.vatNumber"
                  placeholder="Enter VAT number"
                />
                <mat-icon matPrefix>description</mat-icon>
                <mat-hint>Tax identification number</mat-hint>
              </mat-form-field>
            </div>
          }
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
    MatCheckboxModule,
  ],
})
export class AddressRegistrationScreen {
  readonly #registrationStore = inject(RegistrationStore);

  readonly formData = linkedSignal(this.#registrationStore.address);

  readonly addressForm = form(this.formData, (path) => {
    required(path.street);
    required(path.streetNumber);
    required(path.zip);
    required(path.city);
    required(path.country);
  });
}
