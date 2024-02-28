import { Component, input, signal } from '@angular/core';
import { AnswerStatus } from '@app/holidays/feature/quiz/model';
import { interval } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-quiz-status',
  template: ` @if (timeLeft() > 0) {
      <p>Time Left: {{ timeLeft() }} seconds</p>
    } @else if (timeLeft() < 0) {
      <p>Time is up!</p>
    }
    <p>Status:</p>
    <p>
      <span class="text-green-500 pr-4">Correct: {{ status().correct }}</span
      ><span class="text-red-500">Incorrect: {{ status().incorrect }}</span>
    </p>`,
  standalone: true,
})
export class QuizStatusComponent {
  status = input.required<Record<AnswerStatus, number>>();

  timeLeft = signal(180);
  timeStarted = signal(new Date());

  constructor() {
    interval(1000)
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.timeLeft.set(
          180 -
            Math.floor(
              (new Date().getTime() - this.timeStarted().getTime()) / 1000,
            ),
        );
      });
  }
}
