import { Routes } from '@angular/router';
import { HolidaysComponent } from './holidays/holidays.component';
import { RequestInfoComponent } from './request-info/request-info.component';
import {
  provideHttpClient,
  withInterceptors,
  withRequestsMadeViaParent
} from '@angular/common/http';
import { holidaysInterceptor } from './holidays.interceptor';
import { provideHolidays } from './+state';

const holidayRoutes: Routes = [
  {
    path: '',
    providers: [
      provideHolidays,
      provideHttpClient(withRequestsMadeViaParent(), withInterceptors([holidaysInterceptor]))
    ],
    component: HolidaysComponent
  },
  {
    path: 'request-info/:id',
    component: RequestInfoComponent
  }
];

export default holidayRoutes;
