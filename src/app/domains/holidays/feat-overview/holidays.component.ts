import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { HolidayCardComponent } from '../ui/holiday-card/holiday-card.component';
import { httpResource } from '@angular/common/http';
import { parseHolidays } from '../model/holiday';

@Component({
  selector: 'app-holidays',
  template: `<h2>Choose among our Holidays</h2>
    @if (holidays.hasValue()) {
      <div class="flex flex-wrap justify-evenly">
        @for (holiday of holidays.value(); track holiday.id) {
          <app-holiday-card [holiday]="holiday"></app-holiday-card>
        }
      </div>
    }`,
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
  protected readonly holidays = httpResource(() => '/holiday', {
    defaultValue: [],
    parse: parseHolidays,
  });
}
