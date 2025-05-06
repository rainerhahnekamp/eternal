import { Routes } from '@angular/router';
import { HolidaysComponent } from '../feat-overview/holidays.component';
import { QuizComponent } from '../sub-quiz/quiz.component';
import { RequestBrochureComponent } from '../feat-brochure/request-brochure.component';
import { EditHolidayComponent } from '../feat-edit/edit-holiday.component';

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
      {
        path: 'edit/:id',
        component: EditHolidayComponent,
      },
    ],
  },
] satisfies Routes;
