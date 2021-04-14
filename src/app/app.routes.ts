import { Routes } from '@angular/router';
import { UserLoaderGuard } from './core/user-loader.guard';
import { HomeComponent } from './home/home.component';

export const APP_ROUTES: Routes = [
  {
    path: '',
    canActivate: [UserLoaderGuard],
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'security',
        loadChildren: () => import('./security/security.module').then((m) => m.SecurityModule)
      },
      {
        path: 'customer',
        loadChildren: () => import('./customer/customer.module').then((m) => m.CustomerModule)
      },
      {
        path: 'holidays',
        loadChildren: () => import('./holidays/holidays.module').then((m) => m.HolidaysModule)
      },
      {
        path: 'diary',
        loadChildren: () => import('./diary/diary.module').then((m) => m.DiaryModule)
      }
    ]
  }
];
