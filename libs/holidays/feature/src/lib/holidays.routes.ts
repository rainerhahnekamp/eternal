import { Routes } from '@angular/router';
import { HolidaysComponent } from './holidays/holidays.component';
import { RequestInfoComponent } from './request-info/request-info.component';
import { holidaysDataProvider } from '@eternal/holidays/data';
import { HolidaysDataGuard } from './holidays-data-.guard';

export const holidaysRoutes: Routes = [
  {
    path: '',
    canActivate: [HolidaysDataGuard],
    providers: holidaysDataProvider,
    children: [
      {
        path: '',
        component: HolidaysComponent,
      },
      {
        path: 'request-info/:holidayId',
        component: RequestInfoComponent,
      },
    ],
  },
];
