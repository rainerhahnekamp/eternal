import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { DontLeaveMeDirectiveModule } from '../../shared/dont-leave-me.directive';
import { HolidayCardComponent } from './holiday-card.component';

@NgModule({
  declarations: [HolidayCardComponent],
  exports: [HolidayCardComponent],
  imports: [MatCardModule, CommonModule, RouterModule, DontLeaveMeDirectiveModule, MatButtonModule]
})
export class HolidayCardComponentModule {}
