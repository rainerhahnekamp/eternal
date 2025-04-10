import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { HolidayCardComponent } from './ui/holiday-card.component';
import { HolidayStore } from './data/holiday-store';

@Component({
  selector: 'app-holidays',
  templateUrl: `./holidays.component.html`,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    HolidayCardComponent,
  ],
})
export class HolidaysComponent {
  readonly #holidayStore = inject(HolidayStore);

  protected readonly holidays = this.#holidayStore.holidays;

  addFavourite(id: number) {
    this.#holidayStore.addFavourite(id);
  }

  removeFavourite(id: number) {
    this.#holidayStore.removeFavourite(id);
  }
}
