import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { NewsletterComponent } from './newsletter/newsletter.component';
import { SecurityService } from 'src/app/shared/security';
import { inject } from '@angular/core';
import { filter } from 'rxjs/operators';
import { Configuration } from '@app/shared/config';
import { ChatComponent } from '@app/chat/chat.component';
import { FlightsContainerComponent } from '@app/holidays/feature/flights-container.component';

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
        return inject(SecurityService).loaded$.pipe(filter(Boolean));
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
      { path: 'flights', component: FlightsContainerComponent },
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
