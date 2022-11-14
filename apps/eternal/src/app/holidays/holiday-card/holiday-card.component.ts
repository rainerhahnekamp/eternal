import { Component, Input } from '@angular/core';
import { Holiday } from '../holiday';
import { MatCardModule } from '@angular/material/card';
import { NgClass, NgIf } from '@angular/common';
import { BlinkerDirective } from '../../shared/blinker.directive';
import { RouterLinkWithHref } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'eternal-holiday-card',
  templateUrl: './holiday-card.component.html',
  styleUrls: ['./holiday-card.component.scss'],
  imports: [MatCardModule, NgIf, NgClass, BlinkerDirective, RouterLinkWithHref, MatButtonModule],
  standalone: true
})
export class HolidayCardComponent {
  @Input() holiday: Holiday | undefined;
}
