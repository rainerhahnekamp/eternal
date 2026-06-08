import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';

import { MatAnchor, MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { form, validate, FormRoot } from '@angular/forms/signals';
import { isValidAddress } from './internal/is-valid-address';
import { TextFieldComponent } from '../../../shared/form/text-field';

@Component({
  selector: 'app-request-info',
  templateUrl: './request-brochure-page.html',
  imports: [FormRoot, MatButton, RouterLink, MatAnchor, TextFieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestBrochurePage {
  private readonly isExistingAddress = { value: () => true };

  protected readonly lookupResult = computed(() => {
    const isExistingAddress = this.isExistingAddress.value();
    return isExistingAddress === undefined
      ? ''
      : isExistingAddress
        ? 'Brochure sent'
        : 'Address not found';
  });

  private readonly addressModel = signal({ address: '', count: 1 });

  protected readonly addressForm = form(this.addressModel, (path) => {
    validate(path.address, (ctx) => {
      return isValidAddress(ctx.value())
        ? null
        : { kind: 'invalidAddress', message: 'Address is invalid' };
    });
  });
}
