import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { HolidaysEffects } from './+state/holidays.effects';
import { holidaysFeature } from './+state/holidays.reducer';
import { HolidaysComponent, HolidaysComponentModule } from './holidays/holidays.component';
import {
  RequestInfoComponent,
  RequestInfoComponentModule
} from './request-info/request-info.component';

@NgModule({
  imports: [
    HolidaysComponentModule,
    RequestInfoComponentModule,
    RouterModule.forChild([
      {
        path: '',
        component: HolidaysComponent
      },
      {
        path: 'request-info/:holidayId',
        component: RequestInfoComponent
      }
    ]),
    StoreModule.forFeature(holidaysFeature),
    EffectsModule.forFeature([HolidaysEffects])
  ]
})
export class HolidaysModule {}
