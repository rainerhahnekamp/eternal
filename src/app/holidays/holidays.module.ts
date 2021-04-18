import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { ReactiveComponentModule } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { HolidaysEffects } from './+state/holidays.effects';
import { holidaysFeatureKey, holidaysReducer } from './+state/holidays.reducer';
import { HolidaysComponent } from './holidays/holidays.component';
import { RequestInfoComponent } from './request-info/request-info.component';
import { HolidayCardComponent } from './holiday-card/holiday-card.component';

@NgModule({
  declarations: [HolidaysComponent, RequestInfoComponent, HolidayCardComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: HolidaysComponent,
      },
      {
        path: 'request-info/:holidayId',
        component: RequestInfoComponent,
      },
    ]),
    StoreModule.forFeature(holidaysFeatureKey, holidaysReducer),
    EffectsModule.forFeature([HolidaysEffects]),
    ReactiveComponentModule,
  ],
})
export class HolidaysModule {}
