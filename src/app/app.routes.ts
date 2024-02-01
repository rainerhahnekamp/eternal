import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { NewsletterComponent } from './newsletter/newsletter.component';
import { SecurityStore } from 'src/app/shared/security';
import { inject } from '@angular/core';
import { filter } from 'rxjs/operators';
import { Configuration } from '@app/shared/config';
import { ChatComponent } from '@app/chat/chat.component';
import { toObservable } from '@angular/core/rxjs-interop';

export const appRoutes: Routes = [
  {
    path: '',
    canActivate: [
      ({ queryParamMap }: ActivatedRouteSnapshot) => {
        const config = inject(Configuration);

        if (queryParamMap.has('mock-customers')) {
          config.updateFeatures({
            mockCustomers: queryParamMap.get('mock-customers') == '1',
          });
        }
        if (queryParamMap.has('mock-holidays')) {
          config.updateFeatures({
            mockHolidays: queryParamMap.get('mock-holidays') == '1',
          });
        }
      },
      () => {
        return toObservable(inject(SecurityStore).loaded).pipe(filter(Boolean));
      },
    ],
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      { path: 'home', redirectTo: '' },
      {
        path: 'holidays',
        loadChildren: () => import('@app/holidays/feature'),
      },
      {
        path: 'customer',
        loadChildren: () => import('@app/customers/feature'),
      },
      {
        path: 'bookings',
        loadChildren: () => import('@app/bookings'),
      },
      { path: 'newsletter', component: NewsletterComponent },
      {
        path: 'diary',
        loadChildren: () => import('@app/diary'),
      },
      { path: 'chat', component: ChatComponent },
    ],
  },
];
