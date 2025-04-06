import { Component, computed, inject, signal } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { AddressLookuper } from './internal/address-lookuper.service';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatAnchor, MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { isValidAddress } from './internal/is-valid-address';

@Component({
  selector: 'app-request-info',
  templateUrl: './request-brochure.component.html',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatIcon,
    MatLabel,
    MatInput,
    MatButton,
    MatHint,
    RouterLink,
    MatAnchor,
  ],
})
export class RequestBrochureComponent {
  readonly #formBuilder = inject(NonNullableFormBuilder);
  readonly #address = signal('');
  readonly #isExistingAddress = inject(AddressLookuper).lookup(this.#address);
  protected readonly lookupResult = computed(() => {
    const isExistingAddress = this.#isExistingAddress.value();
    return isExistingAddress === undefined
      ? ''
      : isExistingAddress
        ? 'Brochure sent'
        : 'Address not found';
  });

  formGroup = this.#formBuilder.group({
    address: [
      '',
      (ac: AbstractControl) =>
        isValidAddress(ac.value) ? null : { invalidAddress: true },
    ],
  });

  async search() {
    if (this.formGroup.invalid) {
      return;
    }

    this.#address.set(this.formGroup.getRawValue().address);
  }
}
