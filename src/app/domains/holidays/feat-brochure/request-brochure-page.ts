import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';

import { MatAnchor, MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import {
  form,
  validate,
  FormRoot,
  validateAsync,
} from '@angular/forms/signals';
import { isValidAddress } from './internal/is-valid-address';
import { TextFieldComponent } from '../../../shared/form/text-field';
import { AddressLookuper } from './internal/address-lookuper.service';

@Component({
  selector: 'app-request-info',
  templateUrl: './request-brochure-page.html',
  imports: [FormRoot, MatButton, RouterLink, MatAnchor, TextFieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestBrochurePage {
  protected readonly brochureSent = signal('');

  private readonly addressModel = signal({ address: '', count: 1 });

  protected readonly addressForm = form(
    this.addressModel,
    (path) => {
      validate(path.address, (ctx) => {
        return isValidAddress(ctx.value())
          ? null
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
    },
    {
      submission: {
        action: async () => {
          this.brochureSent.set('Brochure sent');
        },
        ignoreValidators: 'none',
      },
    },
  );
}
