import {
  Component,
  inject,
  input,
  numberAttribute,
  OnInit,
} from '@angular/core';
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
import { map, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
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
})
export class RequestBrochurePage implements OnInit {
  readonly #formBuilder = inject(NonNullableFormBuilder);
  readonly lookuper = inject(AddressLookuper);
  readonly address$ = new Subject<string>();

  readonly lookupResult$ = this.address$.pipe(
    switchMap((query) => this.lookuper.lookup(query)),
    map((isValid) => (isValid ? 'Brochure sent' : 'Address not found')),
  );

  id = input.required({ transform: numberAttribute });

  ngOnInit() {
    console.log('RequestBrochurePage initialized with id:', this.id());
  }

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

    this.address$.next(this.formGroup.getRawValue().address);
  }
}
