import {
  Component,
  effect,
  inject,
  input,
  numberAttribute,
  untracked,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { JsonPipe, NgClass } from '@angular/common';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
} from '@angular/material/card';
import { QuizStatusComponent } from '@app/holidays/feature/quiz/quiz-status.component';
import { QuizQuestionComponent } from '@app/holidays/feature/quiz/quiz-question.component';
import { QuizStore } from './quiz-store';

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
        (answer)="quizStore.answer(question.id, $event)"
      ></app-quiz-question>
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
    QuizQuestionComponent,
  ],
})
export class QuizComponent {
  protected readonly quizStore = inject(QuizStore);
  readonly id = input.required({ transform: numberAttribute });

  // Logic
  readonly #loadEffect = effect(() => {
    const id = this.id();

    untracked(async () => {
      this.quizStore.load(id);
    });
  });
}
