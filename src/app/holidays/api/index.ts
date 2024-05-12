import { HolidaysComponent } from '@app/holidays/feat-overview';
import { RequestInfoComponent } from '@app/holidays/feat-brochure';
import { QuizComponent } from '@app/holidays/feat-quiz';
import {
  provideHttpClient,
  withInterceptors,
  withRequestsMadeViaParent,
} from '@angular/common/http';
import { holidaysInterceptor } from './holidays.interceptor';

export { holidaysInterceptor } from './holidays.interceptor';

export default [
  {
    path: '',
    providers: [
      provideHttpClient(
        withRequestsMadeViaParent(),
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
      {
        path: 'quiz/:id',
        component: QuizComponent,
      },
    ],
  },
];
