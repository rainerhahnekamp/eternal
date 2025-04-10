import { computed, inject } from '@angular/core';
import { QuizService } from './internal/quiz.service';
import { AnswerStatus } from '../model/model';
import { assertDefined } from '../../../../shared/util/assert-defined';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tap } from 'rxjs/operators';

export interface QuizState {
  _id: number;
}

const initialState: QuizState = {
  _id: 0,
};

export const QuizStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withProps((store) => {
    const quizService = inject(QuizService);
    return { resource: quizService.findById(store._id) };
  }),
  withMethods((store) => {
    return {
      setId: rxMethod<number>(tap((id) => patchState(store, { _id: id }))),
      handleAnswer(questionId: number, choiceId: number) {
        const quiz = store.resource.value();
        assertDefined(quiz);

        const question = quiz.questions.find(
          (question) => question.id === questionId,
        );
        assertDefined(question);

        const questions = quiz.questions.map((question) => {
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
        });

        store.resource.update(() => ({ ...quiz, questions }));
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

      const quiz = state.resource.value();
      if (!quiz) {
        return status;
      }

      for (const question of quiz.questions) {
        status[question.status]++;
      }

      return status;
    }),
    quiz: computed(() => state.resource.value()),
  })),
);
