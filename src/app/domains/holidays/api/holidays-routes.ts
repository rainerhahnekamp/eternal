import { Routes } from '@angular/router';
import { HolidaysComponent } from '../feat-overview/holidays.component';
import { QuizComponent } from '../sub-quiz/quiz.component';
import { RequestBrochureComponent } from '../feat-brochure/request-brochure.component';

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
