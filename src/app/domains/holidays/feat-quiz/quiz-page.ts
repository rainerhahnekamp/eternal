import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  numberAttribute,
} from '@angular/core';
// ✅ correct
import { QuizStore } from './data/quiz-store';
// ✅ correct
import { QuizStatusComponent } from './ui/quiz-status';
// ✅ correct
import { QuizQuestion } from './ui/quiz-question';
// ✅ correct
import { AnswerStatus } from './model/model';
// ✅ correct
import { createHoliday } from '../model/holiday';
// ❌ This should be allowed
import { HolidayApi } from '../api/holiday.api';
// ✅ correct
import { QuizApi } from './api/quiz.api';
// ✅ correct
import { createCustomer } from '../../customers/model/customer';
// ✅ correct
import { BlinkerDirective } from '../../../shared/ui/blinker.directive';
// ✅ correct
import { SharedModel } from '../../../shared/model/shared.model';
// ✅ correct
import { domainUi } from '../ui/ui';

const q:AnswerStatus = 'correct';
const h = createHoliday()
const api = HolidayApi
const quizApi = QuizApi
const customer = createCustomer()
const sharedModel:SharedModel = {}
const domainUI = domainUi
/**
 * Cases
 * ./model
 * ./ui
 * .data
 * ./api
 *
 * ../api
 * ../model
 * ../ui
 *
 * shared
 */

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
  imports: [QuizStatusComponent, QuizQuestion, BlinkerDirective],
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
