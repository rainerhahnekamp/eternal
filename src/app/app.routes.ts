import { Routes } from '@angular/router';
import QuizComponent from './quiz.component';

export const appRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: QuizComponent,
      },
    ],
  },
];
