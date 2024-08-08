import { Component, input, output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Question } from '@app/holidays/feature/quiz/model';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-quiz-question',
  template: ` <mat-card
    class="max-w-lg my-4"
    role="region"
    [attr.aria-label]="question().question"
  >
    <mat-card-header>{{ question().question }}</mat-card-header>
    <mat-card-content>
      @let choices = question().choices;
      <div
        class="grid gap-4 w-full my-4"
        [ngClass]="choices.length === 3 ? 'grid-cols-3' : 'grid-cols-2'"
      >
        @for (choice of choices; track choice) {
          <button mat-raised-button (click)="answer.emit(choice.id)">
            {{ choice.text }}
          </button>
        }
      </div>

      @let status = question().status;
      @if (status !== 'unanswered') {
        <div
          class="my-2 border-2 p-1"
          [ngClass]="
            status === 'correct' ? 'border-green-500' : 'border-red-500'
          "
        >
          @switch (status) {
            @case ('correct') {
              <p class="text-green-500 font-bold">Right Answer</p>
            }
            @case ('incorrect') {
              <p class="text-red-500 font-bold">Wrong Answer</p>
            }
          }

          <p class="italic">{{ question().explanation }}</p>
        </div>
      }
    </mat-card-content>
  </mat-card>`,
  standalone: true,
  imports: [MatButton, MatCardModule, NgClass],
})
export class QuizQuestionComponent {
  readonly question = input.required<Question>();
  readonly answer = output<number>();
}
