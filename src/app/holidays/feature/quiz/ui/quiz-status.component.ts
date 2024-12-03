import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  signal,
} from '@angular/core';
import { AnswerStatus } from '../model';

@Component({
  selector: 'app-quiz-status',
  template: `
    <p>
      <span class="text-green-500 pr-4">Correct: {{ status.correct }}</span
      ><span class="text-red-500">Incorrect: {{ status.incorrect }}</span>
    </p>`,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizStatusComponent {
  @Input() status: Record<AnswerStatus, number> = {
    unanswered: 0,
    correct: 0,
    incorrect: 0,
  };
}
