import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  numberAttribute,
  untracked,
} from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { QuizStore } from './data/quiz.store';
import { QuizQuestionComponent } from './ui/quiz-question.component';
import { QuizStatusComponent } from './ui/quiz-status.component';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  imports: [MatCardModule, QuizQuestionComponent, QuizStatusComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizComponent {
  readonly id = input.required({ transform: numberAttribute });
  protected readonly quizStore = inject(QuizStore);

  constructor() {
    effect(() => {
      const id = this.id();
      untracked(() => {
        this.quizStore.setId(id);
      });
    });
  }
}
