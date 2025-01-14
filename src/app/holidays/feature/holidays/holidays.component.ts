import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AsyncPipe, NgForOf } from '@angular/common';
import { HolidayCardComponent } from '@app/holidays/ui';
import { Holiday } from '@app/holidays/model';
import { fromHolidays, holidaysActions } from '@app/holidays/data';

@Component({
    selector: 'app-holidays',
    template: `<h2>Choose among our Holidays</h2>
    <div class="flex flex-wrap justify-evenly">
      @for (holiday of holidays(); track byId($index, holiday)) {
        <app-holiday-card
          [holiday]="holiday"
          (addFavourite)="addFavourite($event)"
          (removeFavourite)="removeFavourite($event)"
        >
        </app-holiday-card>
      }
    </div> `,
    imports: [AsyncPipe, HolidayCardComponent, NgForOf]
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
