import {
  Component,
  computed,
  effect,
  inject,
  input,
  numberAttribute,
  PLATFORM_ID,
  signal,
  untracked,
} from '@angular/core';
import { AnswerStatus, Quiz } from '@app/holidays/feature/quiz/model';
import { MatButton } from '@angular/material/button';
import { QuizService } from '@app/holidays/feature/quiz/quiz.service';
import { isPlatformServer, JsonPipe, NgClass } from '@angular/common';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
} from '@angular/material/card';
import { assertDefined } from '@app/shared/util';
import { interval } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/**
 * Clock
 * Current as computed
 * Amount of answered/unanswered
 */

@Component({
  selector: 'app-quiz',
  template: ` <h2>{{ title() }}</h2>
    @if (timeLeft() > 0) {
      <p>Time Left: {{ timeLeft() }} seconds</p>
    } @else if (timeLeft() < 0) {
      <p>Time is up!</p>
    }
    <p>Status:</p>
    <p>
      <span class="text-green-500 pr-4">Correct: {{ status().correct }}</span
      ><span class="text-red-500">Incorrect: {{ status().incorrect }}</span>
    </p>
    @for (question of questions(); track question) {
      <mat-card class="max-w-lg my-4">
        <mat-card-header>{{ question.question }}</mat-card-header>
        <mat-card-content>
          <div
            class="grid gap-4 w-full my-4"
            [ngClass]="
              question.choices.length === 3 ? 'grid-cols-3' : 'grid-cols-2'
            "
          >
            @for (choice of question.choices; track choice) {
              <button
                mat-raised-button
                (click)="answer(question.id, choice.id)"
              >
                {{ choice.text }}
              </button>
            }
          </div>

          @if (question.status !== 'unanswered') {
            <div
              class="my-2 border-2 p-1"
              [ngClass]="
                question.status === 'correct'
                  ? 'border-green-500'
                  : 'border-red-500'
              "
            >
              @switch (question.status) {
                @case ('correct') {
                  <p class="text-green-500 font-bold">Right Answer</p>
                }
                @case ('incorrect') {
                  <p class="text-red-500 font-bold">Wrong Answer</p>
                }
              }

              <p class="italic">{{ question.explanation }}</p>
            </div>
          }
        </mat-card-content>
      </mat-card>
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
  ],
})
export class QuizComponent {
  isServer = isPlatformServer(inject(PLATFORM_ID));
  quizService = inject(QuizService);
  id = input.required({ transform: numberAttribute });

  quiz = signal<Quiz>({ title: '', questions: [], timeInSeconds: 180 });
  questions = computed(() => this.quiz().questions);
  title = computed(() => this.quiz().title);
  timeInSeconds = computed(() => this.quiz().timeInSeconds);

  timeStarted = signal(new Date());
  timeLeft = signal(0);

  status = computed(() => {
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

  constructor() {
    effect(async () => {
      const quiz = await this.quizService.findById(this.id());

      untracked(() => this.quiz.set(quiz));
    });

    if (this.isServer) {
      this.timeLeft.set(this.timeInSeconds());
      return;
    }
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

  answer(questionId: number, choiceId: number) {
    const question = this.questions().find(
      (question) => question.id === questionId,
    );
    assertDefined(question);

    this.quiz.update((quiz) => {
      const questions = this.quiz().questions.map((question) => {
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
