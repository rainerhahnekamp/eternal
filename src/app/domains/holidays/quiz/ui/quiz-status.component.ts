import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AnswerStatus } from '../model/model';

@Component({
  selector: 'app-quiz-status',
  template: ` @let status = this.status();
    <p>Status:</p>
    <p>
      <span class="text-green-500 pr-4">Correct: {{ status.correct }}</span
      ><span class="text-red-500">Incorrect: {{ status.incorrect }}</span>
    </p>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class QuizStatusComponent {
  readonly status = input.required<Record<AnswerStatus, number>>();
}
