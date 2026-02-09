import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatError,
  MatFormField,
  MatHint,
  MatLabel,
} from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatAnchor, MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { FormField, form, submit, validate } from '@angular/forms/signals';
import { isValidAddress } from './internal/is-valid-address';

@Component({
  selector: 'app-request-info',
  templateUrl: './request-brochure-page.html',
  imports: [
    ReactiveFormsModule,
    MatError,
    MatFormField,
    MatIcon,
    MatLabel,
    MatInput,
    MatButton,
    MatHint,
    RouterLink,
    MatAnchor,
    FormField,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestBrochurePage {
  readonly #address = signal('');
  readonly #isExistingAddress = { value: () => true };
  protected readonly lookupResult = computed(() => {
    const isExistingAddress = this.#isExistingAddress.value();
    return isExistingAddress === undefined
      ? ''
      : isExistingAddress
        ? 'Brochure sent'
        : 'Address not found';
  });

  readonly #addressModel = signal({ address: '' });

  addressForm = form(this.#addressModel, (path) => {
    validate(path.address, (ctx) => {
      return isValidAddress(ctx.value())
        ? null
        : { kind: 'invalidAddress', message: 'Address is invalid' };
    });
  });

  search(event: Event) {
    event.preventDefault();
    void submit(this.addressForm, async () =>
      this.#address.set(this.addressForm.address().value()),
    );
  }
}
