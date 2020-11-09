import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {holidaysActions} from '../+state/holidays.actions';
import {fromHolidays} from '../+state/holidays.selectors';
import {Holiday} from '../holiday';

@Component({
  selector: 'eternal-holidays',
  templateUrl: './holidays.component.html',
  styleUrls: ['./holidays.component.scss']
})
export class HolidaysComponent implements OnInit {
  holidays$: Observable<Holiday[]>;

  constructor(private store: Store) {
  }

  ngOnInit(): void {
    this.store.dispatch(holidaysActions.findHolidays());
    this.holidays$ = this.store.select(fromHolidays.get);
  }
}
