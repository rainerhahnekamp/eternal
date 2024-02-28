import {
  ChangeDetectionStrategy,
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
import { DatePipe, JsonPipe, NgClass } from '@angular/common';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
} from '@angular/material/card';
import { assertDefined } from '@app/shared/util';
import { QuizStatusComponent } from '@app/holidays/feature/quiz/quiz-status.component';

/**
 * Clock
 * Current as computed
 * Amount of answered/unanswered
 */

@Component({
  selector: 'app-quiz',
  template: ` <h2>{{ title() }}</h2>
    <p class="border-4 p-4">Last Rendering {{ now() | date: 'HH:mm:ss' }}</p>
    <app-quiz-status [status]="status" [timeStarted]="timeStarted()" />
    <button mat-raised-button (click)="reset()">Reset</button>
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
    QuizStatusComponent,
    DatePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizComponent {
  quizService = inject(QuizService);
  id = input.required({ transform: numberAttribute });
  timeStarted = signal(new Date());

  quiz = signal<Quiz>({ title: '', questions: [], timeInSeconds: 180 });
  questions = computed(() => this.quiz().questions);
  title = computed(() => this.quiz().title);

  status: Record<AnswerStatus, number> = {
    unanswered: 0,
    correct: 0,
    incorrect: 0,
  };

  constructor() {
    effect(async () => {
      const id = this.id();
      untracked(() => this.loadQuiz(id));
    });
  }

  protected reset() {
    const id = this.id();
    this.loadQuiz(id);
  }

  private async loadQuiz(id: number) {
    const quiz = await this.quizService.findById(id);
    this.quiz.set(quiz);
    this.timeStarted.set(new Date());
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

    this.updateStatus();
  }

  private updateStatus() {
    this.status = { unanswered: 0, correct: 0, incorrect: 0 };
    for (const question of this.questions()) {
      this.status[question.status]++;
    }
  }

  now() {
    return new Date();
  }
}
