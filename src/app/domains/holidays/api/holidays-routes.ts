import { Routes } from '@angular/router';
import { HolidaysComponent } from '../feat-overview/holidays.component';
import { RequestInfoComponent } from '../feat-brochure/request-info.component';
import { QuizComponent } from '../feat-quiz/quiz.component';

export default [
  {
    path: '',
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
] satisfies Routes;
