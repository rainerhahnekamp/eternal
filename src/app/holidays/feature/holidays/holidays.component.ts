import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { holidaysActions } from '../+state/holidays.actions';
import { fromHolidays } from '../+state/holidays.selectors';
import { AsyncPipe, NgForOf } from '@angular/common';
import { HolidayCardComponent } from '@app/holidays/ui';
import { Holiday } from '@app/holidays/model';

@Component({
  selector: 'app-holidays',
  template: `<h2>Choose among our Holidays</h2>
    <div class="flex flex-wrap justify-evenly">
      @for (holiday of holidays$ | async; track byId($index, holiday)) {
      <app-holiday-card
        [holiday]="holiday"
        (addFavourite)="addFavourite($event)"
        (removeFavourite)="removeFavourite($event)"
      >
      </app-holiday-card>
      }
    </div> `,
  standalone: true,
  imports: [AsyncPipe, HolidayCardComponent, NgForOf],
})
export class HolidaysComponent implements OnInit {
  #store = inject(Store);
  holidays$ = this.#store.select(fromHolidays.selectHolidaysWithFavourite);

  ngOnInit(): void {
    this.#store.dispatch(holidaysActions.load());
  }

  addFavourite(id: number) {
    this.#store.dispatch(holidaysActions.addFavourite({ id }));
  }

  removeFavourite(id: number) {
    this.#store.dispatch(holidaysActions.removeFavourite({ id }));
  }

  byId(index: number, holiday: Holiday) {
    return holiday.id;
  }
}
