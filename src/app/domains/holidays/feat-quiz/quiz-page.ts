import { JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  numberAttribute,
  Resource,
} from '@angular/core';
import { QuizQuestion } from './ui/quiz-question';
import { QuizStatusComponent } from './ui/quiz-status';
import { QuizStore } from './data/quiz-store';
import { Question } from './model/model';

@Component({
  selector: 'app-quiz',
  template: `
    @if (store.error()) {
      <p>Error loading quiz</p>
      <pre>{{ store.error() | json }}</pre>
    } @else if (store.hasValue()) {
      @let quiz = store.value();
      <h2>{{ quiz.title }}</h2>
      <app-quiz-status
        [timeLeft]="store.timeLeft()"
        [status]="store.quizStatus()"
      />
      @for (question of quiz.questions; track question) {
        <app-quiz-question
          [question]="question"
          (answer)="store.handleAnswer($event)"
        ></app-quiz-question>
      }
    }
  `,
  imports: [QuizStatusComponent, QuizQuestion, JsonPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizPage {
  protected readonly store = inject(QuizStore) satisfies Resource<{
    title: string;
    questions: Question[];
    timeInSeconds: number;
  }>;

  readonly id = input.required({ transform: numberAttribute });

  constructor() {
    this.store.loadQuiz(this.id);
  }
}
