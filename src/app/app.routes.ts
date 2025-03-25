import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { inject } from '@angular/core';
import { filter } from 'rxjs/operators';
import { toObservable } from '@angular/core/rxjs-interop';
import { Configuration } from './shared/config/configuration';
import { SecurityStore } from './shared/security/security-store';

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
        loadChildren: () => import('./domains/holidays/api/holidays-routes'),
      },
      {
        path: 'customer',
        loadChildren: () =>
          import('./domains/customers/feature/customers.routes'),
      },
      {
        path: 'bookings',
        loadChildren: () => import('./domains/bookings/bookings.routes'),
      },
      {
        path: 'newsletter',
        loadComponent: () => import('./newsletter/newsletter.component'),
      },
      {
        path: 'diary',
        loadChildren: () => import('./domains/diary/diary.routes'),
      },
      { path: 'chat', loadComponent: () => import('./chat/chat.component') },
      {
        path: 'basket',
        loadComponent: () => import('./basket/basket.component'),
      },
    ],
  },
];
