import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Observable, of, Subject } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { AsyncPipe, NgIf, NgStyle } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Holiday } from '../model/holiday';
import { HolidaysRepository } from '../+state/holidays-repository.service';
import { HolidayCardComponent } from '../holiday-card/holiday-card.component';
import { validateAddress } from '../../shared/validate-address';

@Component({
  selector: 'eternal-request-info',
  templateUrl: './request-info.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    HolidayCardComponent,
    NgIf,
    AsyncPipe,
    NgStyle,
    RouterLink
  ]
})
export class RequestInfoComponent implements OnInit {
  #lookuper = { lookup: (query: string) => of(true) };
  #formBuilder = inject(NonNullableFormBuilder);
  #route = inject(ActivatedRoute);
  #holidaysRepository = inject(HolidaysRepository);

  formGroup = this.#formBuilder.group({
    address: ['', [validateAddress]]
  });
  @Input() address = '';
  @Output() brochureSent = new EventEmitter<string>();

  submitter$ = new Subject<void>();
  lookupResult$: Observable<string> | undefined;
  holiday$: Observable<Holiday> = this.#holidaysRepository.selected$;

  ngOnInit(): void {
    this.#route.paramMap.subscribe((paramMap) =>
      this.#holidaysRepository.select(Number(paramMap.get('id')))
    );

    if (this.address) {
      this.formGroup.setValue({ address: this.address });
    }

    this.lookupResult$ = this.submitter$.pipe(
      switchMap(() => {
        const { address } = this.formGroup.getRawValue();
        return this.#lookuper.lookup(address).pipe(tap(() => this.brochureSent.emit(address)));
      }),
      map((found) => (found ? 'Brochure sent' : 'Address not found'))
    );
  }

  search(): void {
    this.submitter$.next();
  }
}
