import { computed, inject, Injectable, signal } from '@angular/core';
import { AnswerStatus, Question, Quiz } from '@app/holidays/feature/quiz/model';
import { assertDefined } from '@app/shared/util';
import { interval } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { QuizService } from '@app/holidays/feature/quiz/quiz.service';

@Injectable({ providedIn: 'root' })
export class QuizzStore {
  // State
  readonly #state = signal<Quiz>({
    title: '',
    loaded: false,
    timeInSeconds: 180,
    questions: new Array<Question>(),
  });

  // Slices
  readonly title = computed(() => this.#state().title);
  readonly loaded = computed(() => this.#state().loaded);
  readonly timeInSeconds = computed(() => this.#state().timeInSeconds);
  readonly questions = computed(() => this.#state().questions);

  readonly timeStarted = signal(new Date());
  readonly timeLeft = signal(0);

  readonly status = computed(() => {
    const status: Record<AnswerStatus, number> = {
      unanswered: 0,
      correct: 0,
      incorrect: 0,
    };

    for (const question of this.questions()) {
      status[question.status]++;
    }

    return status;
  });

  readonly #quizService = inject(QuizService);

  constructor() {
    interval(1000)
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.timeLeft.set(
          this.timeInSeconds() -
            Math.floor(
              (new Date().getTime() - this.timeStarted().getTime()) / 1000,
            ),
        );
      });
  }

  async load(id: number) {
    const quiz = await this.#quizService.findById(id);
    this.#state.set(quiz);
  }

  answer(questionId: number, choiceId: number) {
    const question = this.questions().find(
      (question) => question.id === questionId,
    );
    assertDefined(question);

    this.#state.update((quiz) => {
      const questions = this.#state().questions.map((question) => {
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

      return { ...quiz, questions };
    });
  }
}
