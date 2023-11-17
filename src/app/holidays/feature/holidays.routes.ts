import { Routes } from '@angular/router';
import { HolidaysComponent } from './holidays/holidays.component';
import { RequestInfoComponent } from './request-info/request-info.component';
import { HolidaysRepository, provideHolidays } from '@app/holidays/data';
import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';

export const holidaysRoutes: Routes = [
  {
    path: '',
    canActivate: [
      () => {
        const repo = inject(HolidaysRepository);
        repo.load();
        return toObservable(repo.isLoaded).pipe(filter(Boolean));
      },
    ],
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
