import { Routes } from '@angular/router';
import { HolidaysComponent } from '../feat-overview/holidays.component';
import { RequestBrochureComponent } from '../feat-brochure/request-brochure.component';
import { loadRemoteModule } from '@angular-architects/native-federation';

export default [
  {
    path: '',
    children: [
      {
        path: '',
        component: HolidaysComponent,
      },
      {
        path: 'request-brochure/:holidayId',
        component: RequestBrochureComponent,
      },
      {
        path: 'quiz/:id',
        loadComponent: () =>
          loadRemoteModule({
            remoteEntry: 'http://localhost:4201/remoteEntry.json',
            exposedModule: 'quiz',
          }),
      },
    ],
  },
] satisfies Routes;
