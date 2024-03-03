import { Component, inject, input } from '@angular/core';
import { CdTracker } from '@app/holidays/feature/cd-tracker.service';

@Component({
  selector: 'app-cd-tracker',
  template: `{{ trackCd() }}`,
  standalone: true,
})
export class CdTrackerComponent {
  cdTracker = inject(CdTracker);
  componentName = input.required<string>();

  trackCd() {
    this.cdTracker.track(this.componentName());
  }
}
