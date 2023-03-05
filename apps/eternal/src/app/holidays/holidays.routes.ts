import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { findHolidays } from './+state/holidays.effects';
import { holidaysFeature } from './+state/holidays.reducer';
import { HolidaysComponent } from './holidays/holidays.component';
import { RequestInfoComponent } from './request-info/request-info.component';

const holidayRoutes: Routes = [
  {
    path: '',
    providers: [provideState(holidaysFeature), provideEffects({ holidays: findHolidays })],
    component: HolidaysComponent
  },
  {
    path: 'request-info/:holidayId',
    component: RequestInfoComponent
  }
];

export default holidayRoutes;
