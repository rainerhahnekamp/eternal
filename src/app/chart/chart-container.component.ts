import { Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { ChartComponent } from '@app/chart/chart.component';
import { isPlatformBrowser } from '@angular/common';

@Component({
  template: ` <app-chart [chartData]="chartData()" />`,
  standalone: true,
  imports: [ChartComponent],
})
export default class ChartContainerComponent {
  protected readonly chartData = signal([40, 60
  ]);

  isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor() {
    if (this.isBrowser) {
      setInterval(() => {
        const left = Math.random() * 100;

        this.chartData.set([left, 100 - left]);
      }, 2500);
    }
  }
}
