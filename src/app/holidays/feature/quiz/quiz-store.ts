import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { AnswerStatus, Question } from '@app/holidays/feature/quiz/model';
import { computed, inject } from '@angular/core';
import { QuizService } from '@app/holidays/feature/quiz/quiz.service';
import { assertDefined } from '@app/shared/util';
import { interval, pipe, switchMap } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { tap } from 'rxjs/operators';

export const QuizStore = signalStore(
  {
    providedIn: 'root',
  },
  withState({
    title: '',
    loaded: false,
    timeInSeconds: 180,
    questions: new Array<Question>(),
    timeStarted: new Date(),
    timeLeft: 0,
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

    updateTimeLeft: rxMethod<unknown>(
      pipe(
        tap(() => {
          patchState(store, {
            timeLeft:
              store.timeInSeconds() -
              Math.floor(
                (new Date().getTime() - store.timeStarted().getTime()) / 1000,
              ),
          });
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
  })),

  withHooks((store) => ({
    onInit() {
      store.updateTimeLeft(interval(1000));
    },
  })),
);
