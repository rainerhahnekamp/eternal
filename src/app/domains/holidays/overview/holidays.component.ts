import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { HolidayService } from './data/holiday.service';
import { HolidayCardComponent } from './ui/holiday-card.component';

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
  readonly #holidayService = inject(HolidayService);

  protected readonly holidays = this.#holidayService.holidays;

  addFavourite(id: number) {
    this.#holidayService.addFavourite(id);
  }

  removeFavourite(id: number) {
    this.#holidayService.removeFavourite(id);
  }
}
