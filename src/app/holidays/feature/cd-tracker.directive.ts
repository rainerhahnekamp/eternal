import { Directive, input, ViewContainerRef } from '@angular/core';
import { CdTrackerComponent } from '@app/holidays/feature/cd-tracker.component';

export type Valid = 'red' | 'color';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[data-cd-tracker]',
  standalone: true,
})
export class CdTrackerDirective {
  dataCdTracker = input.required<Valid>({ alias: 'data-cd-tracker' });

  constructor(viewContainerRef: ViewContainerRef) {
    const tracker = viewContainerRef.createComponent(CdTrackerComponent);
    tracker.setInput('componentName', this.dataCdTracker);
  }
}
