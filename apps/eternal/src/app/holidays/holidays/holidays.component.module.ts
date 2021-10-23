import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HolidayCardComponentModule } from '../holiday-card/holiday-card.component.module';
import { HolidaysComponent } from './holidays.component';

@NgModule({
  declarations: [HolidaysComponent],
  exports: [HolidaysComponent],
  imports: [CommonModule, HolidayCardComponentModule]
})
export class HolidaysComponentModule {}
