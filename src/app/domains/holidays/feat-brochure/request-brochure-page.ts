import {
  ChangeDetectionStrategy,
  Component,
  inject,
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
import { isValidAddress } from './internal/is-valid-address';
import { AddressLookuper } from './internal/address-lookuper.service';
import {
  Field,
  form,
  submit,
  validate,
  validateAsync,
} from '@angular/forms/signals';

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
    Field,
    MatError,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestBrochurePage {
  readonly #formModel = signal({ address: '' });
  protected readonly brochureSent = signal(false);
  addressForm = form(this.#formModel, (path) => {
    validate(path.address, ({ value }) => {
      return isValidAddress(value())
        ? undefined
        : { kind: 'invalidAddress', message: 'Address is invalid' };
    });

    validateAsync(path.address, {
      params: ({ value }) => value(),
      factory: (query) => inject(AddressLookuper).lookup(() => query() || ''),
      onSuccess: (result: boolean) =>
        result
          ? undefined
          : { kind: 'unknownAddress', message: 'Address not found' },
      onError: () => ({
        kind: 'unknownAddress',
        message: 'Address not found',
      }),
    });
  });

  search(event: Event) {
    event.preventDefault();
    void submit(this.addressForm, async () => this.brochureSent.set(true));
  }
}
