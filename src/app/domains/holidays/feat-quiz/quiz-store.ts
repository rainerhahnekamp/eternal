import { httpResource } from '@angular/common/http';
import { computed, ResourceStatus } from '@angular/core';
import {
  patchState,
  signalMethod,
  signalStore,
  withComputed,
  withFeature,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { AnswerStatus } from './model';
import { toQuiz } from './quiz.service';
import { updateCountdown, withCountdown } from './with-countdown';
import { withResource } from './with-resource';

export interface QuizState {
  quizId: number;
}

const initialState: QuizState = {
  quizId: 0,
};

export const QuizStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withCountdown(60),
  withFeature(({ quizId }) => {
    return withResource(
      httpResource(
        () => {
          const id = quizId();
          if (id === 0) {
            return undefined;
          }

          return `/holiday/${id}/quiz`;
        },
        {
          parse: (value) => toQuiz(value, quizId()),
          defaultValue: {
            title: '',
            questions: [],
            timeInSeconds: 0,
          },
        },
      ),
    );
  }),
  withProps((store) => ({
    questions: computed(() =>
      store.hasValue() ? store.value().questions : [],
    ),
  })),
  withComputed(({ questions }) => {
    return {
      quizStatus: () => {
        const status: Record<AnswerStatus, number> = {
          unanswered: 0,
          correct: 0,
          incorrect: 0,
        };

        for (const question of questions()) {
          status[question.status]++;
        }

        return status;
      },
    };
  }),
  withMethods((store) => ({
    handleAnswer(event: { questionId: number; choiceId: number }): void {
      const question = store.questions().find((q) => q.id === event.questionId);
      if (!question) return;

      patchState(store, ({ value }) => ({
        value: {
          ...value,
          questions: value.questions.map((q) =>
            q.id === event.questionId
              ? {
                  ...q,
                  status:
                    q.answer === event.choiceId
                      ? 'correct'
                      : ('incorrect' as AnswerStatus),
                }
              : q,
          ),
        },
      }));
    },
    loadQuiz: signalMethod<number>((quizId) => patchState(store, { quizId })),
  })),
  withHooks((store) => ({
    onInit: () => {
      signalMethod<ResourceStatus>((status) => {
        if (status !== 'resolved') {
          return;
        }

        patchState(store, updateCountdown(store.value().timeInSeconds));
      })(store.status);
    },
  })),
);
