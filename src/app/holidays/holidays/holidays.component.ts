import { Component, inject } from '@angular/core';
import { HolidayCardComponent } from '../holiday-card/holiday-card.component';
import { AsyncPipe, NgForOf } from '@angular/common';
import { HolidaysRepository } from '../+state';

@Component({
  selector: 'app-holidays',
  template: `
    <div class="container">
      @for (holiday of holidays(); track holiday) {
      <app-holiday-card [holiday]="holiday" data-testid="holiday-card" />
      }
    </div>
  `,
  styleUrls: ['./holidays.component.scss'],
  standalone: true,
  imports: [HolidayCardComponent, NgForOf, AsyncPipe],
})
export class HolidaysComponent {
  holidays = inject(HolidaysRepository).holidays;
}
