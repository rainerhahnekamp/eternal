import { Routes } from '@angular/router';
import { HolidaysComponent } from './holidays/holidays.component';
import { RequestInfoComponent } from './request-info/request-info.component';
import { holidaysDataProvider } from '@eternal/holidays/data';
import { HolidaysDataGuard } from './holidays-data-.guard';
import { importProvidersFrom } from '@angular/core';
import { FormlyModule } from '@ngx-formly/core';
import { FileField } from '@eternal/shared/ui';

export const holidaysRoutes: Routes = [
  {
    path: '',
    canActivate: [HolidaysDataGuard],
    providers: [
      ...holidaysDataProvider,
      importProvidersFrom(
        FormlyModule.forChild({
          types: [{ name: 'file', component: FileField }],
        })
      ),
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
    ],
  },
];
