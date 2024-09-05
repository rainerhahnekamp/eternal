import { Component, inject, Input, OnInit } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Observable, of, Subject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe, NgIf } from '@angular/common';
import { assertDefined } from '@app/shared/util';
import { AddressLookuper } from '@app/holidays/feature/address-lookuper.service';

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
    AsyncPipe,
    NgIf,
  ],
})
export class RequestInfoComponent implements OnInit {
  #formBuilder = inject(NonNullableFormBuilder);
  #lookuper = inject(AddressLookuper);

  formGroup = this.#formBuilder.group({
    address: [''],
  });
  title = 'Request More Information';
  @Input() address = '';
  submitter$ = new Subject<void>();
  lookupResult$: Observable<string> | undefined;

  ngOnInit(): void {
    if (this.address) {
      this.formGroup.setValue({ address: this.address });
    }

    this.lookupResult$ = this.submitter$.pipe(
      switchMap(() => {
        assertDefined(this.formGroup.value.address);
        return this.#lookuper.lookup(this.formGroup.value.address);
      }),
      map((found) => (found ? 'Brochure sent' : 'Address not found')),
    );
  }

  search(): void {
    this.submitter$.next();
  }
}
