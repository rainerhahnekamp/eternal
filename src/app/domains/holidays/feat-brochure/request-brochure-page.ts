import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatAnchor, MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { isValidAddress } from './internal/is-valid-address';
import { AddressLookuper } from './internal/address-lookuper.service';

@Component({
  selector: 'app-request-info',
  templateUrl: './request-brochure-page.html',
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestBrochurePage {
  readonly #formBuilder = inject(NonNullableFormBuilder);
  readonly address = input('');
  readonly #address = signal('');
  readonly #lookupResource = inject(AddressLookuper).lookup(this.#address);

  constructor() {
    effect(() => this.formGroup.patchValue({ address: this.address() }));
  }

  protected readonly message = computed(() => {
    if (this.#lookupResource.hasValue()) {
      return this.#lookupResource.value()
        ? 'Brochure sent'
        : 'Address not found';
    }

    return '';
  });

  protected readonly formGroup = this.#formBuilder.group({
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
