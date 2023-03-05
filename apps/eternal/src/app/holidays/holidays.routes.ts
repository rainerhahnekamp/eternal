import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { findHolidays } from './+state/holidays.effects';
import { holidaysFeature } from './+state/holidays.reducer';
import { HolidaysComponent } from './holidays/holidays.component';
import { RequestInfoComponent } from './request-info/request-info.component';
import {
  provideHttpClient,
  withInterceptors,
  withRequestsMadeViaParent
} from '@angular/common/http';
import { holidaysInterceptor } from './holidays.interceptor';

const holidayRoutes: Routes = [
  {
    path: '',
    providers: [
      provideState(holidaysFeature),
      provideEffects({ holidays: findHolidays }),
      provideHttpClient(withRequestsMadeViaParent(), withInterceptors([holidaysInterceptor]))
    ],
    component: HolidaysComponent
  },
  {
    path: 'request-info/:holidayId',
    component: RequestInfoComponent
  }
];

export default holidayRoutes;
