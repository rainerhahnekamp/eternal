import { Component, effect, inject, input, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatAnchor, MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { AddressLookuper } from './internal/address-lookuper.service';

@Component({
  selector: 'app-request-info',
  templateUrl: './request-info.component.html',
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
export class RequestInfoComponent {
  #formBuilder = inject(NonNullableFormBuilder);
  #lookuper = inject(AddressLookuper);

  formGroup = this.#formBuilder.group({
    address: [''],
  });
  title = 'Request More Information';
  address = input('');
  lookupResult = signal('');

  constructor() {
    effect(() => {
      const address = this.address();
      if (!address) {
        return;
      }
      this.formGroup.patchValue({ address });
    });
  }

  async search() {
    const found = await lastValueFrom(
      this.#lookuper.lookup(this.formGroup.getRawValue().address),
    );
    this.lookupResult.set(found ? 'Brochure sent' : 'Address not found');
  }
}
