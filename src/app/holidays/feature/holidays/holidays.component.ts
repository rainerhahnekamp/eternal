import { Component, computed, inject, OnInit } from '@angular/core';
import { AsyncPipe, NgForOf } from '@angular/common';
import { HolidayCardComponent } from '@app/holidays/ui';
import { Holiday } from '@app/holidays/model';
import { HolidaysRepository } from '@app/holidays/data';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-holidays',
  template: `<h2>Choose among our Holidays</h2>
    @if(holiday(); as holiday) {

    <input [(ngModel)]="holiday.title" />
    }
    <div class="flex flex-wrap justify-evenly">
      @for (holiday of repository.holidaysWithFavourites(); track byId($index,
      holiday)) {
      <app-holiday-card
        [holiday]="holiday"
        (addFavourite)="addFavourite($event)"
        (removeFavourite)="removeFavourite($event)"
      >
      </app-holiday-card>
      }
    </div> `,
  standalone: true,
  imports: [AsyncPipe, HolidayCardComponent, NgForOf, FormsModule],
})
export class HolidaysComponent implements OnInit {
  protected repository = inject(HolidaysRepository);
  protected holidays = this.repository.holidays;
  holiday = computed(() => {
    const holidays = this.holidays();
    if (holidays.length) {
      return holidays[0];
    }

    return undefined;
  });

  ngOnInit(): void {
    this.repository.load();
  }

  addFavourite(id: number) {
    this.repository.addFavourite(id);
  }

  removeFavourite(id: number) {
    this.repository.removeFavourite(id);
  }

  byId(index: number, holiday: Holiday) {
    return holiday.id;
  }
}
