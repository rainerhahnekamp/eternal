import {
  Component,
  effect,
  inject,
  input,
  numberAttribute,
  signal,
  untracked,
} from '@angular/core';
import { Question } from '@app/holidays/feature/quiz/model';
import { MatButton } from '@angular/material/button';
import { QuizService } from '@app/holidays/feature/quiz/quiz.service';
import { NgClass } from '@angular/common';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
} from '@angular/material/card';
import { assertDefined } from '@app/shared/util';

/**
 * Clock
 * Current as computed
 * Amount of answered/unanswered
 */

@Component({
  selector: 'app-quiz',
  template: `@for (question of questions(); track question) {
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
            <button mat-raised-button (click)="answer(question.id, choice.id)">
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
  ],
})
export class QuizComponent {
  quizService = inject(QuizService);
  id = input.required({ transform: numberAttribute });
  questions = signal<
    (Question & { status: 'correct' | 'incorrect' | 'unanswered' })[]
  >([]);

  constructor() {
    effect(async () => {
      const questions = await this.quizService.findQuestions(this.id());

      untracked(() =>
        this.questions.set(
          questions.map((question) => ({ ...question, status: 'unanswered' })),
        ),
      );
    });
  }

  answer(questionId: number, choiceId: number) {
    const question = this.questions().find(
      (question) => question.id === questionId,
    );
    assertDefined(question);

    this.questions.update((questions) =>
      questions.map((question) => {
        if (question.id === questionId) {
          return {
            ...question,
            status: question.answer === choiceId ? 'correct' : 'incorrect',
          };
        } else {
          return question;
        }
      }),
    );
  }
}
