import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  numberAttribute,
} from '@angular/core';
import { QuizStore } from './data/quiz-store';
import { QuizStatusComponent } from './ui/quiz-status';
import { QuizQuestion } from './ui/quiz-question';



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
  imports: [QuizStatusComponent, QuizQuestion,],
  providers: [QuizStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizPage {
  quizStore = inject(QuizStore);
  id = input.required({ transform: numberAttribute });

  constructor() {
    this.quizStore.setId(this.id);
  }

  handleAnswer($event: { questionId: number; choiceId: number }) {
    this.quizStore.answer($event.questionId, $event.choiceId);
  }
}
