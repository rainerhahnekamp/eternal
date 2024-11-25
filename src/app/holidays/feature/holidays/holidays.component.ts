import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, NgForOf } from '@angular/common';
import { HolidayCardComponent } from '@app/holidays/ui';
import { Holiday } from '@app/holidays/model';
import { HolidaysStore } from '../../data/holidays-store.service';

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
  standalone: true,
  imports: [AsyncPipe, HolidayCardComponent, NgForOf],
})
export class HolidaysComponent implements OnInit {
  #store = inject(HolidaysStore);

  holidays = this.#store.holidaysWithFavourite;

  ngOnInit(): void {
    this.#store.get();
  }

  addFavourite(id: number) {
    this.#store.addFavourite(id);
  }

  removeFavourite(id: number) {
    this.#store.removeFavourite(id);
  }

  byId(index: number, holiday: Holiday) {
    return holiday.id;
  }
}
