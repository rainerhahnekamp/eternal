import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { NewsletterComponent } from './newsletter/newsletter.component';
import { SecurityService } from '@app/security';
import { inject } from '@angular/core';
import { filter } from 'rxjs/operators';
import { Configuration } from '@app/shared';

export const appRoutes: Routes = [
  {
    path: '',
    canActivate: [
      ({ queryParamMap }: ActivatedRouteSnapshot) => {
        const config = inject(Configuration);

        if (queryParamMap.has('mock-customers')) {
          config.updateFeatures({ mockCustomers: queryParamMap.get('mock-customers') == '1' });
        }
        if (queryParamMap.has('mock-holidays')) {
          config.updateFeatures({ mockHolidays: queryParamMap.get('mock-holidays') == '1' });
        }
      },
      () => {
        return inject(SecurityService).loaded$.pipe(filter(Boolean));
      }
    ],
    children: [
      {
        path: '',
        component: HomeComponent
      },
      { path: 'home', redirectTo: '' },
      { path: 'newsletter', component: NewsletterComponent },
      {
        path: 'customer',
        loadChildren: () => import('./customer/customer.routes')
      },
      {
        path: 'holidays',
        loadChildren: () => import('./holidays/holidays.routes')
      },
      {
        path: 'diary',
        loadChildren: () => import('./diary/diary.routes.module')
      }
    ]
  }
];
