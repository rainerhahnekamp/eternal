import { Routes } from '@angular/router';
import { HolidaysComponent } from './holidays/holidays.component';
import { RequestInfoComponent } from './request-info/request-info.component';
import { provideHolidays } from '@app/holidays/data';

export const holidaysRoutes: Routes = [
  {
    path: '',
    providers: [provideHolidays()],
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
