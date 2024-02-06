import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { HolidaysEffects } from './+state/holidays.effects';
import { holidaysFeature } from './+state/holidays.reducer';
import { HolidaysComponent } from './holidays/holidays.component';
import { RequestInfoComponent } from './request-info/request-info.component';
import { apiCheckGuard } from './api-check.guard';
import { BasketComponent } from '@app/holidays/feature/basket.component';

export const holidaysRoutes: Routes = [
  {
    path: '',
    canActivate: [apiCheckGuard],
    providers: [
      provideState(holidaysFeature),
      provideEffects([HolidaysEffects]),
    ],
    children: [
      {
        path: '',
        component: HolidaysComponent,
      },
      {
        path: 'request-info/:holidayId',
        component: RequestInfoComponent,
      },
      {
        path: 'basket',
        component: BasketComponent,
      },
    ],
  },
];
