import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { holidaysActions } from '../+state/holidays.actions';
import { fromHolidays } from '../+state/holidays.selectors';
import { HolidayCardComponentModule } from '../holiday-card/holiday-card.component.module';

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

@NgModule({
  declarations: [HolidaysComponent],
  exports: [HolidaysComponent],
  imports: [CommonModule, HolidayCardComponentModule]
})
export class HolidaysComponentModule {}
