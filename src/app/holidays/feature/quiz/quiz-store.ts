import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { AnswerStatus, Question } from '@app/holidays/feature/quiz/model';
import { assertDefined } from '@app/shared/util';
import { computed, inject } from '@angular/core';
import { QuizService } from '@app/holidays/feature/quiz/quiz.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap } from 'rxjs';
import { tap } from 'rxjs/operators';
import { withCountdown } from '@app/holidays/feature/quiz/with-countdown';

export const QuizStore = signalStore(
  withState({
    title: '',
    questions: [] as Question[],
  }),
  withCountdown(),
  withMethods((store) => {
    const quizService = inject(QuizService);

    return {
      load: rxMethod<number>(
        pipe(
          switchMap((id) => quizService.findById(id)),
          tap((quiz) => {
            patchState(store, quiz);
            store.startCountdown(quiz.timeInSeconds);
          }),
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
    };
  }),
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
);
