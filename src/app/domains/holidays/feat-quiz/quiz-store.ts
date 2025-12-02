import {
  patchState,
  signalMethod,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { AnswerStatus, Question } from './model';
import { QuizService } from './quiz.service';
import { inject } from '@angular/core';
import { interval } from 'rxjs';
import { assertDefined } from '../../../shared/util/assert-defined';
import { tap } from 'rxjs/operators';
import {
  addFavourite,
  removeAllFavourites,
  removeFavourites,
  withFavourites,
} from '../../../shared/signal-store-features/with-favourites';

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
  timeInSeconds: 0,
  timeStarted: new Date(),
  timeLeft: 0,
};

export const QuizStore = signalStore(
  { providedIn: 'root' },
  withState<QuizState>(initialState),
  withComputed(({ questions }) => ({
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
  })),
  withMethods((store, quizService = inject(QuizService)) => ({
    loadQuiz: signalMethod<number>(async (id) => {
      if (store.timeLeft() > 0) {
        patchState(store, { timeLeft: 0 });
      }
      const quiz = await quizService.findById(id);

      patchState(store, quiz, { timeLeft: quiz.timeInSeconds });
    }),

    startTimer: rxMethod<number>(
      tap(() => {
        console.log('timer runs');
        patchState(store, {
          timeLeft:
            store.timeInSeconds() -
            Math.floor(
              (new Date().getTime() - store.timeStarted().getTime()) / 1000,
            ),
        });
      }),
    ),

    handleAnswer($event: { questionId: number; choiceId: number }) {
      const question = store
        .questions()
        .find((q) => q.id === $event.questionId);
      assertDefined(question);

      const modifiedQuestions = store.questions().map((q) => {
        if (q.id === $event.questionId) {
          const status: AnswerStatus =
            q.answer === $event.choiceId ? 'correct' : 'incorrect';
          return { ...q, status };
        }
        return q;
      });

      patchState(store, { questions: modifiedQuestions });
    },
  })),
);
