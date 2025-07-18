import { isPlatformServer } from '@angular/common';
import { computed, inject, PLATFORM_ID } from '@angular/core';
import {
  patchState,
  signalMethod,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { interval } from 'rxjs';
import { assertDefined } from '../../../../shared/util/assert-defined';
import { AnswerStatus } from '../model/model';
import { QuizService } from './quiz.service';

export const QuizStore = signalStore(
  withState({
    holidayId: 0,
    timeStarted: new Date(),
    timeLeft: 0,
  }),

  withProps((store) => {
    const quizService = inject(QuizService);
    return {
      _resource: quizService.findById(() => store.holidayId() || undefined),
    };
  }),

  withComputed((store) => ({
    questions: computed(
      () =>
        store._resource.hasValue() ? store._resource.value().questions : [],
      { debugName: 'questions' },
    ),
    timeInSeconds: computed(() =>
      store._resource.hasValue() ? store._resource.value().timeInSeconds : 0,
    ),
    title: computed(() =>
      store._resource.hasValue() ? store._resource.value().title : '',
    ),
  })),

  withMethods((store) => {
    return {
      setId: signalMethod<number>((id) => patchState(store, { holidayId: id })),

      updateTime: signalMethod(() =>
        patchState(store, {
          timeLeft:
            store.timeInSeconds() -
            Math.floor(
              (new Date().getTime() - store.timeStarted().getTime()) / 1000,
            ),
        }),
      ),

      answer(questionId: number, choiceId: number) {
        const question = store
          .questions()
          .find((question) => question.id === questionId);
        assertDefined(question);

        store._resource.value.update((quiz) => {
          if (!quiz) {
            return quiz;
          }

          return {
            ...quiz,
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
          };
        });
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
