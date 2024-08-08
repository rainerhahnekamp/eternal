import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { AnswerStatus, Question } from '@app/holidays/feature/quiz/model';
import { computed, inject } from '@angular/core';
import { QuizService } from '@app/holidays/feature/quiz/quiz.service';
import { assertDefined } from '@app/shared/util';
import { pipe, switchMap } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { withCountdown } from '@app/holidays/feature/quiz/with-countdown';

export const QuizStore = signalStore(
  {
    providedIn: 'root',
  },
  withState({
    title: '',
    loaded: false,
    timeInSeconds: 180,
    questions: new Array<Question>(),
  }),
  withCountdown(),

  withComputed((state) => ({
    status: computed(() => {
      const status: Record<AnswerStatus, number> = {
        unanswered: 0,
        correct: 0,
        incorrect: 0,
      };

      for (const question of state.questions()) {
        status[question.status]++;
      }

      return status;
    }),
  })),

  withMethods((store, quizService = inject(QuizService)) => ({
    load: rxMethod<number>(
      pipe(
        switchMap((id) =>
          quizService.findById(id).pipe(
            tapResponse({
              next: (quiz) => patchState(store, quiz),
              error: console.error,
            }),
          ),
        ),
      ),
    ),

    answer(questionId: number, choiceId: number) {
      const question = store
        .questions()
        .find((question) => question.id === questionId);
      assertDefined(question);

      patchState(store, {
        questions: store.questions().map((question) => {
          if (question.id === questionId) {
            const status: AnswerStatus =
              question.answer === choiceId ? 'correct' : 'incorrect';
            return {
              ...question,
              status,
            };
          } else {
            return question;
          }
        }),
      });
    },
  })),
);
