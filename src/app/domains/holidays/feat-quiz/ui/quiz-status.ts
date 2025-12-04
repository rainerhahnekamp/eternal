import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { QuizStore } from '../data/quiz-store';

@Component({
  selector: 'app-quiz-status',
  template: ` @let timeLeft = quizStore.timeLeft();
    @let status = quizStore.status();
    @if (quizStore.timeLeft() > 0) {
      <p>Time Left: {{ timeLeft }} seconds</p>
    } @else if (timeLeft < 0) {
      <p>Time is up!</p>
    }
    <section aria-label="quiz-status">
      <span class="text-green-500 pr-4">Correct: {{ status.correct }}</span
      ><span class="text-red-500">Incorrect: {{ status.incorrect }}</span>
    </section>`,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizStatusComponent {
  quizStore = inject(QuizStore);
}
