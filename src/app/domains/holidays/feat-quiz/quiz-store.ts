import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  withHooks,
  patchState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { inject } from '@angular/core';
import { Question, AnswerStatus } from './model';
import { QuizService } from './quiz.service';
import { interval, tap, switchMap, pipe } from 'rxjs';

interface QuizState {
  title: string;
  questions: Question[];
  timeInSeconds: number;
  timeStarted: Date;
  timeLeft: number;
}

const initialState: QuizState = {
  title: '',
  questions: [],
  timeInSeconds: 60,
  timeStarted: new Date(),
  timeLeft: 0,
};

export const QuizStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
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
  withMethods((store, quizService = inject(QuizService)) => ({
    loadQuiz: rxMethod<number>(
      pipe(
        switchMap((id) => quizService.findById(id)),
        tap((quiz) => {
          patchState(store, {
            title: quiz.title,
            questions: quiz.questions,
            timeInSeconds: quiz.timeInSeconds,
            timeStarted: new Date(),
          });
        }),
      ),
    ),

    handleAnswer(event: { questionId: number; choiceId: number }): void {
      const question = store.questions().find((q) => q.id === event.questionId);
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

    updateTimeLeft: rxMethod<unknown>(
      tap(() => {
        const timeLeft =
          store.timeInSeconds() -
          Math.floor(
            (new Date().getTime() - store.timeStarted().getTime()) / 1000,
          );
        patchState(store, { timeLeft });
      }),
    ),
  })),
  withHooks({
    onInit: (store) => {
      store.updateTimeLeft(interval(1000));
    },
  }),
);
