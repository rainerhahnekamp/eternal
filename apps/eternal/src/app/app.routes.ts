import { Routes } from '@angular/router';
import { UserLoaderGuard } from './core/user-loader.guard';
import { HomeComponent } from './home.component';
import { NewsletterComponent } from './newsletter/newsletter.component';

export const appRoutes: Routes = [
  {
    path: '',
    canActivate: [UserLoaderGuard],
    children: [
      {
        path: '',
        component: HomeComponent
      },
      { path: 'home', redirectTo: '' },
      { path: 'newsletter', component: NewsletterComponent },
      {
        path: 'customer',
        loadChildren: () => import('./customer/customer.routes').then((m) => m.customerRoutes)
      },
      {
        path: 'holidays',
        loadChildren: () => import('./holidays/holidays.routes').then((m) => m.holidayRoutes)
      },
      {
        path: 'diary',
        loadChildren: () => import('./diary/diary.routes.module').then((m) => m.diaryRoutes)
      }
    ]
  }
];
