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

@Component({
  selector: 'app-quiz',
  template: ` <h2>{{ quizStore.title() }}</h2>
    <app-quiz-status />

    @for (question of quizStore.questions(); track question) {
      <app-quiz-question [question]="question" />
    }`,
  imports: [QuizStatusComponent, QuizQuestion],
  providers: [QuizStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizPage {
  quizStore = inject(QuizStore);
  id = input.required({ transform: numberAttribute });

  constructor() {
    this.quizStore.setId(this.id);
  }
}
