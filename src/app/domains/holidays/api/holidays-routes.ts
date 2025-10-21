import { Routes } from '@angular/router';
import { QuizPage } from '../feat-quiz/quiz-page';
import { RequestBrochurePage } from '../feat-brochure/request-brochure-page';
import { EditHolidayPage } from '../feat-edit/edit-holiday-page';
import { HolidaysPage } from '../feat-overview/holidays-page';

export default [
  {
    path: '',
    children: [
      {
        path: '',
        component: HolidaysPage,
      },
      {
        path: 'request-brochure/:holidayId',
        component: RequestBrochurePage,
      },
      {
        path: 'quiz/:id',
        component: QuizPage,
      },
      {
        path: 'edit/:id',
        component: EditHolidayPage,
      },
    ],
  },
] satisfies Routes;
