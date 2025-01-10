import { Component, input } from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
  selector: 'app-quiz-progress',
  template: ` <div>
    <mat-progress-bar
      mode="determinate"
      [value]="progress()"
    ></mat-progress-bar>
  </div>`,
  imports: [MatProgressBar],
})
export class QuizProgressComponent {
  readonly progress = input.required<number>();
}
