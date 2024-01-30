import { Component, effect, inject, input, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { AddressLookuper } from '../address-lookuper.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-request-info',
  templateUrl: './request-info.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
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
    effect(() => this.formGroup.setValue({ address: this.address() ?? '' }));
  }

  async search() {
    const found = await lastValueFrom(
      this.#lookuper.lookup(this.formGroup.getRawValue().address),
    );
    this.lookupResult.set(found ? 'Brochure sent' : 'Address not found');
  }
}
