import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  numberAttribute,
} from '@angular/core';

import { QuizStore } from './internal/quiz-store';
import { QuizStatusComponent } from './internal/quiz-status.componen';
import { QuizQuestionComponent } from './internal/quiz-question.component';

@Component({
  selector: 'app-quiz',
  template: ` <h2>{{ quizStore.title() }}</h2>
    <app-quiz-status
      [timeLeft]="quizStore.timeLeft()"
      [status]="quizStore.status()"
    />
    @for (question of quizStore.questions(); track question) {
      <app-quiz-question
        [question]="question"
        (answer)="handleAnswer($event)"
      ></app-quiz-question>
    }`,
  imports: [QuizStatusComponent, QuizQuestionComponent],
  providers: [QuizStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizComponent {
  quizStore = inject(QuizStore);
  id = input.required({ transform: numberAttribute });

  constructor() {
    this.quizStore.setId(this.id);
  }

  handleAnswer($event: { questionId: number; choiceId: number }) {
    this.quizStore.answer($event.questionId, $event.choiceId);
  }
}
