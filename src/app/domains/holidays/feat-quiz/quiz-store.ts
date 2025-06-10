import { httpResource } from '@angular/common/http';
import { computed, ResourceStatus } from '@angular/core';
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
import { AnswerStatus } from './model';
import { updateCountdown, withCountdown } from './with-countdown';
import { toQuiz } from './quiz.service';

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
  withProps(({ quizId }) => {
    const _resource = httpResource(
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
    );
    return {
      _resource,
      resource: _resource.asReadonly(),
    };
  }),
  withComputed(({ resource }) => {
    const questions = computed(() =>
      resource.hasValue() ? resource.value().questions : [],
    );
    return {
      questions,
      status: () => {
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

      store._resource.update((value) => ({
        ...value,
        questions: value.questions.map((q) =>
          q.id === event.questionId
            ? {
                ...q,
                status: q.answer === event.choiceId ? 'correct' : 'incorrect',
              }
            : q,
        ),
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

        patchState(
          store,
          updateCountdown(store._resource.value().timeInSeconds),
        );
      })(store.resource.status);
    },
  })),
);
