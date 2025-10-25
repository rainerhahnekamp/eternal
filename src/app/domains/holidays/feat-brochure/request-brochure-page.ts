import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
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
import { toSignal } from '@angular/core/rxjs-interop';

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
export class RequestBrochurePage implements OnInit {
  readonly #formBuilder = inject(NonNullableFormBuilder);

  protected readonly formGroup = this.#formBuilder.group({
    address: [
      '',
      (ac: AbstractControl) =>
        isValidAddress(ac.value) ? null : { invalidAddress: true },
    ],
  });
  // readonly #address = signal('');
  readonly #address = toSignal(this.formGroup.controls.address.valueChanges, {
    initialValue: '',
  });
  readonly #addressLookuper = inject(AddressLookuper);
  readonly lookupResource = this.#addressLookuper.getLookupResource(
    this.#address,
  );

  // ngOnInit() {
  // Doesn't work because no injection context
  // this.#addressLookuper.getLookupResource(() => 'Domgasse 5');
  // }

  protected readonly message = computed(() => {
    if (this.#address() === '') {
      return '';
    }

    if (this.lookupResource.hasValue()) {
      return this.lookupResource.value()
        ? 'Brochure sent'
        : 'Address not found';
    }

    return '';
  });

  async search() {
    if (this.formGroup.invalid) {
      return;
    }

    // this.#address.set(this.formGroup.getRawValue().address);
  }
}
