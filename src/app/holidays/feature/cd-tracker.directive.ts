import {
  Directive,
  effect,
  input,
  untracked,
  ViewContainerRef,
} from '@angular/core';
import { CdTrackerComponent } from '@app/holidays/feature/cd-tracker.component';

export type Valid = 'red' | 'color';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[data-cd-tracker]',
  standalone: true,
})
export class CdTrackerDirective {
  dataCdTracker = input.required<string>({ alias: 'data-cd-tracker' });

  constructor(viewContainerRef: ViewContainerRef) {
    effect(() => {
      const trackerId = this.dataCdTracker();

      untracked(() => {
        const tracker = viewContainerRef.createComponent(CdTrackerComponent);
        tracker.setInput('componentName', trackerId);
      });
    });
  }
}
