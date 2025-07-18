import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-quiz-status',
  template: ` @if (timeLeft() > 0) {
      <p aria-label="Time remaining">Time Left: {{ timeLeft() }} seconds</p>
    } @else if (timeLeft() < 0) {
      <p aria-label="Time status">Time is up!</p>
    }
    <p>Status:</p>
    <p role="status">
      <span class="text-green-500 pr-4">Correct: {{ status().correct }}</span
      ><span class="text-red-500">Incorrect: {{ status().incorrect }}</span>
    </p>`,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizStatusComponent {
  timeLeft = input.required<number>();
  status = input.required<{ correct: number; incorrect: number }>();
}
