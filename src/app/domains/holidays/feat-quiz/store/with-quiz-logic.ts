import {
  patchState,
  signalStoreFeature,
  type,
  withMethods,
} from '@ngrx/signals';
import { QuizState } from './with-quiz-state';
import { QuizService } from '../quiz.service';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { AnswerStatus } from '../model';
import { CountdownState, updateCountdown } from '../with-countdown';

export function withQuizLogic<_>() {
  return signalStoreFeature(
    type<{ state: QuizState & CountdownState }>(),
    withMethods((store, quizService = inject(QuizService)) => ({
      loadQuiz: rxMethod<number>(
        pipe(
          switchMap((id) => quizService.findById(id)),
          tap((quiz) => {
            patchState(
              store,
              {
                title: quiz.title,
                questions: quiz.questions,
              },
              updateCountdown(quiz.timeInSeconds),
            );
          }),
        ),
      ),

      handleAnswer(event: { questionId: number; choiceId: number }): void {
        const question = store
          .questions()
          .find((q) => q.id === event.questionId);
        if (!question) return;

        patchState(store, {
          questions: store.questions().map((q) => {
            if (q.id === event.questionId) {
              const status: AnswerStatus =
                q.answer === event.choiceId ? 'correct' : 'incorrect';
              return { ...q, status };
            }
            return q;
          }),
        });
      },
    })),
  );
}
