import { Routes } from '@angular/router';
import { HolidaysComponent } from '../overview/holidays.component';
import { QuizComponent } from '../quiz/quiz.component';
import { RequestBrochureComponent } from '../brochure/request-brochure.component';

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
        component: QuizComponent,
      },
    ],
  },
] satisfies Routes;
