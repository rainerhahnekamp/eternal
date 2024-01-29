import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { AddressLookuper } from '../address-lookuper.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RequestInfoComponentHolidayCard } from '@app/holidays/feature/request-info/request-info-holiday-card.component';

@Component({
  selector: 'app-request-info',
  templateUrl: './request-info.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    RequestInfoComponentHolidayCard,
  ],
})
export class RequestInfoComponent implements OnInit {
  #lookuper = inject(AddressLookuper);
  #formBuilder = inject(NonNullableFormBuilder);

  formGroup = this.#formBuilder.group({
    address: [''],
  });
  @Input() address = '';

  submitter$ = new Subject<void>();
  lookupResult = signal('');

  ngOnInit(): void {
    if (this.address) {
      this.formGroup.setValue({ address: this.address });
    }
  }

  search(): void {
    this.#lookuper
      .lookup(this.formGroup.getRawValue().address)
      .subscribe((found) =>
        this.lookupResult.set(found ? 'Brochure sent' : 'Address not found'),
      );
  }
}
