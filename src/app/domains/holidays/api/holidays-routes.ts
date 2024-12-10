import { Routes } from '@angular/router';
import { HolidaysComponent } from '../feat-overview/holidays.component';
import { RequestInfoComponent } from '../feat-brochure/request-info.component';
import { QuizComponent } from '../sub-quiz/quiz.component';
import { HolidayComponent } from '../ui/holiday.component';

export default [
  {
    path: '',
    children: [
      {
        path: '',
        component: HolidaysComponent,
      },
      { path: 'form', component: HolidayComponent },
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
