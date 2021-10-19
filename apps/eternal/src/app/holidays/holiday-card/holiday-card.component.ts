import { Component, Input, NgModule } from '@angular/core';
import { Holiday } from '../holiday';

@Component({
  selector: 'app-holiday-card',
  templateUrl: './holiday-card.component.html',
  styleUrls: ['./holiday-card.component.scss']
})
export class HolidayCardComponent {
  @Input() holiday: Holiday | undefined;
}

@NgModule({
  declarations: [HolidayCardComponent],
  exports: [HolidayCardComponent],
  imports: []
})
export class HolidayCardComponentModule {}
