import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  numberAttribute,
} from '@angular/core';
import { QuizQuestion } from './quiz-question';
import { QuizStatusComponent } from './quiz-status';
import { QuizStore } from './quiz-store';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-quiz',
  template: `
    @if (store.resource.error()) {
      <p>Error loading quiz</p>
      <pre>{{ store.resource.error() | json }}</pre>
    } @else if (store.resource.hasValue()) {
      @let quiz = store.resource.value();
      <h2>{{ quiz.title }}</h2>
      <app-quiz-status
        [timeLeft]="store.timeLeft()"
        [status]="store.status()"
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
  protected readonly store = inject(QuizStore);

  readonly id = input.required({ transform: numberAttribute });

  constructor() {
    this.store.loadQuiz(this.id);
  }
}
