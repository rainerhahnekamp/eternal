import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { holidaysActions } from '../+state/holidays.actions';
import { fromHolidays } from '../+state/holidays.selectors';

@Component({
  selector: 'eternal-holidays',
  templateUrl: './holidays.component.html',
  styleUrls: ['./holidays.component.scss']
})
export class HolidaysComponent implements OnInit {
  holidays$ = this.store.select(fromHolidays.get);

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(holidaysActions.findHolidays());
  }
}
