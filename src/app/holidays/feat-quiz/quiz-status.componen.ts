import { ChangeDetectionStrategy, Component, inject, input } from "@angular/core";
import { QuizStore } from "@app/holidays/feat-quiz/quiz-store";

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizStatusComponent {
  timeLeft = input.required<number>();
  status = input.required<{ correct: number; incorrect: number }>();

  quizStore = inject(QuizStore)
}
