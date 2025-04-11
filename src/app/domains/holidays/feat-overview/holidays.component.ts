import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { HolidayCardComponent } from '../ui/holiday-card/holiday-card.component';
import { HolidaysStore } from '../data/holidays-store';

@Component({
  selector: 'app-holidays',
  template: `<h2>Choose among our Holidays</h2>
    <div class="flex flex-wrap justify-evenly">
      @for (holiday of holidays(); track holiday.id) {
        <app-holiday-card
          [holiday]="holiday"
          (addFavourite)="addFavourite($event)"
          (removeFavourite)="removeFavourite($event)"
        >
        </app-holiday-card>
      }
    </div> `,
  imports: [
    HolidayCardComponent,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    HolidayCardComponent,
  ],
})
export class HolidaysComponent {
  #holidaysStore = inject(HolidaysStore);
  protected readonly holidays = this.#holidaysStore.holidays;

  addFavourite(id: number) {
    this.#holidaysStore.addFavourite(id);
  }

  removeFavourite(id: number) {
    this.#holidaysStore.removeFavourite(id);
  }
}
