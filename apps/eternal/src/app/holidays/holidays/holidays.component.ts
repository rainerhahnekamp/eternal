import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { holidaysActions } from '../+state/holidays.actions';
import { fromHolidays } from '../+state/holidays.selectors';
import { HolidayCardComponent } from '../holiday-card/holiday-card.component';
import { AsyncPipe, NgForOf } from '@angular/common';

@Component({
  selector: 'eternal-holidays',
  template: `<div class="container">
    <eternal-holiday-card
      *ngFor="let holiday of holidays$ | async"
      [holiday]="holiday"
      data-testid="holiday-card"
    />
  </div> `,
  styleUrls: ['./holidays.component.scss'],
  standalone: true,
  imports: [HolidayCardComponent, NgForOf, AsyncPipe]
})
export class HolidaysComponent implements OnInit {
  #store = inject(Store);
  holidays$ = this.#store.select(fromHolidays.holidays);

  ngOnInit(): void {
    this.#store.dispatch(holidaysActions.load());
  }
}
