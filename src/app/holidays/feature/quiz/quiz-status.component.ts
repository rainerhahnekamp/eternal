import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AnswerStatus } from '@app/holidays/feature/quiz/model';
import { interval, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-quiz-status',
  template: ` @if (timeLeft() > 0) {
      <p>Time Left: {{ timeLeft() }} seconds</p>
    } @else if (timeLeft() < 0) {
      <p>Time is up!</p>
    }
    <p>Status:</p>
    <p>
      <span class="text-green-500 pr-4">Correct: {{ status.correct }}</span
      ><span class="text-red-500">Incorrect: {{ status.incorrect }}</span>
    </p>`,
  standalone: true,
  imports: [AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizStatusComponent {
  @Input() timeStarted = new Date();
  @Input() status: Record<AnswerStatus, number> = {
    unanswered: 0,
    correct: 0,
    incorrect: 0,
  };

  timeLeft = toSignal(
    interval(1000).pipe(
      map(() => {
        return (
          180 -
          Math.floor((new Date().getTime() - this.timeStarted.getTime()) / 1000)
        );
      }),
    ),
    { initialValue: 180 },
  );

  constructor() {}
}
