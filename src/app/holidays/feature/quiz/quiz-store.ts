import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { AnswerStatus, Question } from '@app/holidays/feature/quiz/model';
import { assertDefined } from '@app/shared/util';
import { QuizService } from '@app/holidays/feature/quiz/quiz.service';
import { computed, inject, PLATFORM_ID } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { interval, pipe, switchMap } from 'rxjs';
import { tap } from 'rxjs/operators';
import { isPlatformServer } from '@angular/common';

export const QuizStore = signalStore(
  withState({
    title: '',
    questions: [] as Question[],
    timeInSeconds: 60,
    timeStarted: new Date(),
    timeLeft: 0,
  }),
  withMethods((store) => {
    const quizService = inject(QuizService);
    return {
      setId: rxMethod<number>(
        pipe(
          switchMap((id) => quizService.findById(id)),
          tap((quiz) => patchState(store, quiz)),
        ),
      ),

      updateTime: rxMethod(
        pipe(
          tap(() =>
            patchState(store, {
              timeLeft:
                store.timeInSeconds() -
                Math.floor(
                  (new Date().getTime() - store.timeStarted().getTime()) / 1000,
                ),
            }),
          ),
        ),
      ),

      answer(questionId: number, choiceId: number) {
        const question = store
          .questions()
          .find((question) => question.id === questionId);
        assertDefined(question);

        patchState(store, (quiz) => ({
          questions: quiz.questions.map((question) => {
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
        }));
      },
    };
  }),

  withComputed((state) => {
    return {
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
    };
  }),

  withHooks((store) => {
    const isServer = isPlatformServer(inject(PLATFORM_ID));
    return {
      onInit() {
        if (isServer) {
          return;
        }
        store.updateTime(interval(1000));
      },
    };
  }),
);
