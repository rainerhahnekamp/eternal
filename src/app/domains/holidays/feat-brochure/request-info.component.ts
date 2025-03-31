import { Component, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
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
  address = signal('');
  readonly #res = inject(AddressLookuper).lookup(this.address);

  protected readonly message = computed(() => {
    if (this.#res.value() === undefined) {
      return '';
    }

    return this.#res.value() ? 'Brochure sent' : 'Address not found';
  });

  protected readonly formGroup = this.#formBuilder.group({
    address: [''],
  });
  title = 'Request More Information';
  lookupResult = signal('');

  async search() {
    this.address.set(this.formGroup.getRawValue().address);
  }
}
