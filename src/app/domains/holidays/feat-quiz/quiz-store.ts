import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { inject } from '@angular/core';
import { AnswerStatus, Question } from './model';
import { QuizService } from './quiz.service';
import { pipe, switchMap, tap } from 'rxjs';
import { withCountdown } from './with-countdown';

interface QuizState {
  title: string;
  questions: Question[];
}

const initialState: QuizState = {
  title: '',
  questions: [],
};

export const QuizStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withCountdown(60),
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
  })),
);
