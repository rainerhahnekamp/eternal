import { Component } from '@angular/core';
import { createHoliday } from '@app/holidays/model';
import { HolidayComponent } from '@app/holidays/feature/holiday.component';

@Component({
  selector: 'app-holidays',
  template: ` <app-holiday [username]="username" [holiday]="holiday" />`,
  standalone: true,
  imports: [HolidayComponent],
})
export class HolidayContainerComponent {
  username = 'Konrad Weber';
  holiday = createHoliday();
}
