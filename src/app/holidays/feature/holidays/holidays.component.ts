import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { holidaysActions } from '../+state/holidays.actions';
import { fromHolidays } from '../+state/holidays.selectors';
import { AsyncPipe, NgForOf } from '@angular/common';
import { HolidayCardComponent } from '@app/holidays/ui';
import { Holiday } from '@app/holidays/model';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-holidays',
  standalone: true,
  imports: [AsyncPipe, HolidayCardComponent, NgForOf, MatButton],
  template: `<h2>Choose among our Holidays</h2>

    @defer (on interaction; on timer(1s); prefetch on viewport) {
      <div class="flex flex-wrap justify-evenly">
        @for (holiday of holidays(); track byId($index, holiday)) {
          <app-holiday-card
            [holiday]="holiday"
            (addFavourite)="addFavourite($event)"
            (removeFavourite)="removeFavourite($event)"
          />
        }
      </div>
    } @placeholder {
      <button mat-raised-button>Show me the holidays.</button>
    } @loading (after 0s; minimum 1s) {
      <p>Loading Holidays...</p>
    }`,
})
export class HolidaysComponent {
  #store = inject(Store);
  holidays = this.#store.selectSignal(fromHolidays.selectHolidaysWithFavourite);

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
