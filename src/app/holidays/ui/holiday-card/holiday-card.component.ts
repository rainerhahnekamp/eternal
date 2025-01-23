import { Component, Input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgClass } from '@angular/common';
import { RouterLinkWithHref } from '@angular/router';
import { BlinkerDirective } from '@app/shared/ui';
import { HolidayWithFavourite } from '../../feature/holidays/holidays.service-with-resource';

@Component({
  selector: 'app-holiday-card',
  templateUrl: './holiday-card.component.html',
  styleUrls: ['./holiday-card.component.scss'],
  imports: [
    MatCardModule,
    MatButtonModule,
    BlinkerDirective,
    MatIconModule,
    NgClass,
    RouterLinkWithHref,
  ],
})
export class HolidayCardComponent {
  @Input() holiday: HolidayWithFavourite | undefined;

  addFavourite = output<number>();
  removeFavourite = output<number>();
}
