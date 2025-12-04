import {
  Component,
  inject,
  input,
  ChangeDetectionStrategy,
  numberAttribute,
} from '@angular/core';
import { QuizStore } from './data/quiz-store';
import { QuizStatusComponent } from './ui/quiz-status';
import { QuizQuestion } from './ui/quiz-question';

@Component({
  selector: 'app-quiz',
  template: `
    <h2>{{ store.title() }}</h2>
    <app-quiz-status />
    @for (question of store.questions(); track question) {
      <app-quiz-question [question]="question"></app-quiz-question>
    }
  `,
  imports: [QuizStatusComponent, QuizQuestion],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizPage {
  protected readonly store = inject(QuizStore);
  readonly id = input.required({ transform: numberAttribute });

  constructor() {
    this.store.loadQuiz(this.id);
  }
}
