import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  Injector,
  INJECTOR,
  input,
  numberAttribute,
  signal,
  untracked,
} from '@angular/core';
import { interval } from 'rxjs';
import { assertDefined } from '../../../shared/util/assert-defined';
import { AnswerStatus, Question } from './model';
import { QuizQuestion } from './quiz-question';
import { QuizStatusComponent } from './quiz-status';
import { QuizService } from './quiz.service';
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
        (answer)="quizStore.handleAnswer($event)"
      ></app-quiz-question>
    }`,
  imports: [QuizStatusComponent, QuizQuestion],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizPage {
  protected readonly quizStore = inject(QuizStore);

  id = input.required({ transform: numberAttribute });
  injector = inject(Injector);

  constructor() {
    this.quizStore.loadQuiz(this.id);
    this.quizStore.startTimer(interval(1000));
  }
}
