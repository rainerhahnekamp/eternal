import { signalStoreFeature, type, withComputed } from '@ngrx/signals';
import { QuizState, withQuizState } from './with-quiz-state';
import { AnswerStatus } from '../model';

export function withQuizComputed<_>() {
  return signalStoreFeature(
    withQuizState(),
    withComputed((store) => ({
      status: () => {
        const status: Record<AnswerStatus, number> = {
          unanswered: 0,
          correct: 0,
          incorrect: 0,
        };

        for (const question of store.questions()) {
          status[question.status]++;
        }

        return status;
      },
    })),
  );
}
