import { signalStore } from '@ngrx/signals';
import { withQuizComputed } from './internal/with-quiz-computed';
import { withQuizLogic } from './internal/with-quiz-logic';
import { withQuizState } from './internal/with-quiz-state';
import { withCountdown } from './internal/with-countdown';

export const QuizStore = signalStore(
  { providedIn: 'root' },
  withCountdown(60),
  withQuizState(),
  withQuizComputed(),
  withQuizLogic(),
);
