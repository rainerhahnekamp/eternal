import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  numberAttribute,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { JsonPipe, NgClass } from '@angular/common';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
} from '@angular/material/card';
import { QuizStore } from './quiz-store';
import { QuizStatusComponent } from '@app/holidays/feat-quiz/quiz-status.componen';

@Component({
  selector: 'app-quiz',
  template: ` <h2>{{ quizStore.title() }}</h2>
    <app-quiz-status
      [timeLeft]="quizStore.timeLeft()"
      [status]="quizStore.status()"
    />
    @for (question of quizStore.questions(); track question) {
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
                (click)="quizStore.answer(question.id, choice.id)"
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
    QuizStatusComponent,
    JsonPipe,
  ],
  providers: [QuizStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizComponent {
  quizStore = inject(QuizStore);
  id = input.required({ transform: numberAttribute });

  constructor() {
    this.quizStore.setId(this.id);
  }
}
