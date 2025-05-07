import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-timer',
  template: `<p>Timer: {{ timer() }}</p>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class TimerComponent {
  protected readonly timer = signal(1);

  constructor() {
    setInterval(() => {
      this.timer.update((n) => n + 1);
    }, 1000);
  }
}
