import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
import { map, Subject } from 'rxjs';
import { AsyncPipe } from '@angular/common';

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
    AsyncPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestBrochurePage {
  readonly #formBuilder = inject(NonNullableFormBuilder);
  readonly #address$ = new Subject<string>();

  protected readonly message$ = this.#address$.pipe(
    map((isExistingAddress) =>
      isExistingAddress ? 'Brochure sent' : 'Address not found',
    ),
  );

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

    this.#address$.next(this.formGroup.getRawValue().address);
  }
}
