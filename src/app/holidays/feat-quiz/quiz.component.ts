import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  numberAttribute,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { JsonPipe, NgClass } from '@angular/common';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
} from '@angular/material/card';
import { QuizStore } from './quiz-store';
import { QuizStatusComponent } from '@app/holidays/feat-quiz/quiz-status.componen';
import { QuizQuestionComponent } from '@app/holidays/feat-quiz/quiz-question.component';

@Component({
  selector: 'app-quiz',
  template: `<h2>{{ quizStore.title() }}</h2>
  <app-quiz-status
    [timeLeft]="quizStore.timeLeft()"
    [status]="quizStore.status()"
  />
  @for (question of quizStore.questions(); track question) {
    <app-quiz-question
      [question]="question"
      (answer)="handleAnswer($event.questionId, $event.choiceId)"
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
    QuizStatusComponent,
    QuizQuestionComponent,
    JsonPipe,
  ],
  providers: [QuizStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizComponent {
  quizStore = inject(QuizStore);
  id = input.required({ transform: numberAttribute });

  constructor() {
    this.quizStore.setId(this.id);
  }

  handleAnswer(questionId: number, choiceId: number) {
    this.quizStore.answer(questionId, choiceId);
  }
}
