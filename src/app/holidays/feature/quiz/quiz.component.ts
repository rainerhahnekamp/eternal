import {
  Component,
  computed,
  effect,
  inject,
  input,
  numberAttribute,
  signal,
  untracked,
} from '@angular/core';
import { AnswerStatus, Quiz } from '@app/holidays/feature/quiz/model';
import { MatButton } from '@angular/material/button';
import { QuizService } from '@app/holidays/feature/quiz/quiz.service';
import { JsonPipe, NgClass } from '@angular/common';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
} from '@angular/material/card';
import { assertDefined } from '@app/shared/util';
import { interval } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { QuizStatusComponent } from '@app/holidays/feature/quiz/quiz-status.component';
import { QuizQuestionComponent } from '@app/holidays/feature/quiz/quiz-question.component';

@Component({
  selector: 'app-quiz',
  template: ` <h2>{{ title() }}</h2>
    <app-quiz-status [timeLeft]="timeLeft()" [status]="status()" />
    @for (question of questions(); track question) {
      <app-quiz-question
        [question]="question"
        (answer)="answer(question.id, $event)"
      ></app-quiz-question>
    }`,
  standalone: true,
  imports: [
    MatButton,
    NgClass,
    MatCard,
    MatCardHeader,
    MatCardActions,
    MatCardContent,
    JsonPipe,
    QuizStatusComponent,
    QuizQuestionComponent,
  ],
})
export class QuizComponent {
  readonly #quizService = inject(QuizService);
  readonly id = input.required({ transform: numberAttribute });

  // State
  protected readonly quizState = signal<Quiz>({
    title: '',
    loaded: false,
    timeInSeconds: 180,
    questions: [],
  });

  // Slices
  protected readonly title = computed(() => this.quizState().title);
  protected readonly loaded = computed(() => this.quizState().loaded);
  protected readonly timeInSeconds = computed(
    () => this.quizState().timeInSeconds,
  );
  protected readonly questions = computed(() => this.quizState().questions);

  protected readonly timeStarted = signal(new Date());
  protected readonly timeLeft = signal(0);

  // Derived Values
  protected readonly status = computed(() => {
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

  // Logic
  readonly #loadEffect = effect(() => {
    const id = this.id();

    untracked(async () => {
      const quiz = await this.#quizService.findById(id);
      this.quizState.set(quiz);
    });
  });

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

  protected answer(questionId: number, choiceId: number) {
    const question = this.questions().find(
      (question) => question.id === questionId,
    );
    assertDefined(question);

    this.quizState.update((quiz) => {
      const questions = this.quizState().questions.map((question) => {
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
