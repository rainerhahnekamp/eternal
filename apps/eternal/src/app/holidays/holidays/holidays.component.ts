import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { holidaysActions } from '../+state/holidays.actions';
import { fromHolidays } from '../+state/holidays.selectors';
import { HolidayCardComponent } from '../holiday-card/holiday-card.component';
import { AsyncPipe, NgForOf } from '@angular/common';
import { TestidDirective } from '../../shared/testid.directive';

@Component({
  selector: 'eternal-holidays',
  templateUrl: './holidays.component.html',
  styleUrls: ['./holidays.component.scss'],
  standalone: true,
  imports: [HolidayCardComponent, NgForOf, AsyncPipe, TestidDirective]
})
export class HolidaysComponent implements OnInit {
  #store = inject(Store);
  holidays$ = this.#store.select(fromHolidays.get);

  ngOnInit(): void {
    this.#store.dispatch(holidaysActions.findHolidays());
  }
}
