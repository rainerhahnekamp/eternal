import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { inject } from '@angular/core';
import { filter } from 'rxjs/operators';
import { toObservable } from '@angular/core/rxjs-interop';
import { Configuration } from './shared/config/configuration';
import { SecurityStore } from './shared/security/security-store';
import { ChatComponent } from './chat/chat.component';
import BasketComponent from './basket/basket.component';
import { Grundstuecke } from "./grundstuecks.ng";

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
      { path: 'grundstuecke', component: Grundstuecke },
      {
        path: 'diary',
        loadChildren: () => import('src/app/domains/diary/diary.routes'),
      },
      { path: 'chat', component: ChatComponent },
      { path: 'basket', component: BasketComponent },
    ],
  },
];
