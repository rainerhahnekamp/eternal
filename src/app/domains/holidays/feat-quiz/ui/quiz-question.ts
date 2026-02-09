import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Question } from '../model/model';

@Component({
  selector: 'app-quiz-question',
  template: ` <mat-card class="max-w-lg my-4">
    <mat-card-header
      ><h3 [id]="id()">{{ question().question }}</h3></mat-card-header
    >
    <mat-card-content>
      <div
        class="grid gap-4 w-full my-4"
        role="radiogroup"
        [attr.aria-labelledby]="id()"
        [ngClass]="
          question().choices.length === 3 ? 'grid-cols-3' : 'grid-cols-2'
        "
      >
        @for (choice of question().choices; track choice) {
          <label
            [for]="'choice-' + question().id + '-' + choice.id"
            class="quiz-answer-option"
            [class.quiz-answer-selected]="question().givenAnswer === choice.id"
            [class.quiz-answer-disabled]="question().givenAnswer !== undefined"
          >
            <input
              type="radio"
              [id]="'choice-' + question().id + '-' + choice.id"
              [name]="'question-' + question().id"
              [value]="choice.id"
              [checked]="question().givenAnswer === choice.id"
              [disabled]="question().givenAnswer !== undefined"
              (change)="
                answer.emit({ questionId: question().id, choiceId: choice.id })
              "
              class="sr-only"
            />
            {{ choice.text }}
          </label>
        }
      </div>

      @if (question().givenAnswer !== undefined) {
        <div
          class="my-2 border-2 p-1"
          [ngClass]="
            question().givenAnswer === question().correctAnswer
              ? 'border-green-500'
              : 'border-red-500'
          "
        >
          @if (question().givenAnswer === question().correctAnswer) {
            <p class="text-green-500 font-bold">Right Answer</p>
          } @else {
            <p class="text-red-500 font-bold">Wrong Answer</p>
          }

          <p class="italic">{{ question().explanation }}</p>
        </div>
      }
    </mat-card-content>
  </mat-card>`,
  imports: [MatCardModule, NgClass, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .quiz-answer-option {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px 20px;
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        background-color: #ffffff;
        color: #333333;
        font-size: 16px;
        font-weight: 500;
        text-align: center;
        cursor: pointer;
        transition: all 0.2s ease;
        min-height: 60px;
      }

      .quiz-answer-option:hover:not(.quiz-answer-disabled) {
        border-color: #2193b0;
        background-color: #f0f9fb;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(33, 147, 176, 0.15);
      }

      .quiz-answer-option:active:not(.quiz-answer-disabled) {
        transform: translateY(0);
        box-shadow: 0 2px 4px rgba(33, 147, 176, 0.1);
      }

      .quiz-answer-option.quiz-answer-selected {
        border-color: #2193b0;
        background-color: #e3f4f7;
        color: #2193b0;
        font-weight: 700;
        box-shadow: 0 0 0 3px rgba(33, 147, 176, 0.1);
      }

      .quiz-answer-option.quiz-answer-disabled {
        opacity: 0.6;
        cursor: not-allowed;
        background-color: #f5f5f5;
        border-color: #d0d0d0;
      }

      .quiz-answer-option.quiz-answer-disabled:hover {
        transform: none;
        box-shadow: none;
        border-color: #d0d0d0;
        background-color: #f5f5f5;
      }
    `,
  ],
})
export class QuizQuestion {
  public readonly question = input.required<Question>();
  public readonly answer = output<{ questionId: number; choiceId: number }>();
  protected readonly id = computed(() => `question-${this.question().id}`);
}
