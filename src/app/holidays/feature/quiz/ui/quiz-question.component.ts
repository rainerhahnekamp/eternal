import { Component, input, output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader } from '@angular/material/card';
import { Question } from '../model';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-quiz-question',
  template: ` <mat-card class="max-w-lg my-4">
    <mat-card-header>{{ question().question }}</mat-card-header>
    <mat-card-content>
      <div
        class="grid gap-4 w-full my-4"
        [ngClass]="
          question().choices.length === 3 ? 'grid-cols-3' : 'grid-cols-2'
        "
      >
        @for (choice of question().choices; track choice) {
          <button
            mat-raised-button
            (click)="answer.emit(choice.id)"
            [disabled]="question().status !== 'unanswered'"
          >
            {{ choice.text }}
          </button>
        }
      </div>

      @if (question().status !== 'unanswered') {
        <div
          class="my-2 border-2 p-1"
          [ngClass]="
            question().status === 'correct'
              ? 'border-green-500'
              : 'border-red-500'
          "
        >
          @switch (question().status) {
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
  imports: [MatButton, MatCard, MatCardHeader, MatCardContent, NgClass],
})
export class QuizQuestionComponent {
  readonly question = input.required<Question>();
  readonly answer = output<number>();
}
