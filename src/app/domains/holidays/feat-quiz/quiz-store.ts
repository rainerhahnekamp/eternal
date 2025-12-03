import { signalStore } from '@ngrx/signals';
import { withQuizComputed } from './store/with-quiz-computed';
import { withQuizLogic } from './store/with-quiz-logic';
import { withQuizState } from './store/with-quiz-state';
import { withCountdown } from './with-countdown';

export const QuizStore = signalStore(
  { providedIn: 'root' },
  withCountdown(60),
  withQuizState(),
  withQuizComputed(),
  withQuizLogic(),
);
