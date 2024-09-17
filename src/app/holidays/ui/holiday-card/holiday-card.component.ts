import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgClass, NgIf } from '@angular/common';
import { RouterLinkWithHref } from '@angular/router';
import { BlinkerDirective } from '@app/shared/ui';
import { Holiday } from '@app/holidays/model';

@Component({
  selector: 'app-holiday-card',
  templateUrl: './holiday-card.component.html',
  styleUrls: ['./holiday-card.component.scss'],
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    BlinkerDirective,
    MatIconModule,
    NgClass,
    NgIf,
    RouterLinkWithHref,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HolidayCardComponent {
  holiday = input.required<Holiday & { isFavourite: boolean }>();
  addFavourite = output<number>();
  removeFavourite = output<number>();
}
