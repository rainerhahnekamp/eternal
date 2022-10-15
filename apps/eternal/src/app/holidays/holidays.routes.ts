import { importProvidersFrom, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { HolidaysEffects } from './+state/holidays.effects';
import { holidaysFeature } from './+state/holidays.reducer';
import { HolidaysComponent } from './holidays/holidays.component';
import { RequestInfoComponent } from './request-info/request-info.component';

export const holidayRoutes: Routes = [
  {
    path: '',
    providers: [
      importProvidersFrom([
        StoreModule.forFeature(holidaysFeature),
        EffectsModule.forFeature([HolidaysEffects])
      ])
    ],
    component: HolidaysComponent
  },
  {
    path: 'request-info/:holidayId',
    component: RequestInfoComponent
  }
];
