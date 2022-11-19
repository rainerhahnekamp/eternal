import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Holiday } from '@eternal/holidays/model';
import { HolidayCardComponent } from '@eternal/holidays/ui';
import { AsyncPipe, NgForOf } from '@angular/common';
import { fromHolidays, holidaysActions } from '@eternal/holidays/data';

@Component({
  selector: 'eternal-holidays',
  template: `<h2>Choose among our Holidays</h2>
    <div class="flex flex-wrap justify-evenly">
      <eternal-holiday-card
        *ngFor="let holiday of holidays$ | async; trackBy: byId"
        [holiday]="holiday"
        (addFavourite)="addFavourite($event)"
        (removeFavourite)="removeFavourite($event)"
      >
      </eternal-holiday-card>
    </div> `,
  standalone: true,
  imports: [AsyncPipe, HolidayCardComponent, NgForOf],
})
export class HolidaysComponent {
  #store = inject(Store);

  holidays$ = this.#store.select(fromHolidays.selectHolidaysWithFavourite);

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
