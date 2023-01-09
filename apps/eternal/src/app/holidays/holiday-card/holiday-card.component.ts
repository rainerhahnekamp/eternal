import { Component, Input } from '@angular/core';
import { Holiday } from '../holiday';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { NgClass, NgIf } from '@angular/common';
import { BlinkerDirective } from '../../shared/blinker.directive';
import { RouterLink } from '@angular/router';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';

@Component({
  selector: 'eternal-holiday-card',
  templateUrl: './holiday-card.component.html',
  styleUrls: ['./holiday-card.component.scss'],
  imports: [MatCardModule, NgIf, NgClass, BlinkerDirective, RouterLink, MatButtonModule],
  standalone: true
})
export class HolidayCardComponent {
  @Input() holiday: Holiday | undefined;
}
