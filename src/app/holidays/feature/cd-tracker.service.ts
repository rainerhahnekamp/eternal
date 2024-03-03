import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CdTracker {
  components: Record<string, number> = {};
  track(componentName: string) {
    if (componentName in this.components) {
      this.components[componentName]++;
    } else {
      this.components[componentName] = 1;
    }
  }

  getCdCounts(componentName: string): number | undefined {
    return this.components[componentName];
  }

  reset() {
    this.components = {};
  }
}
