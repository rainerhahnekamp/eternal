import {
  afterNextRender,
  Component,
  effect,
  input,
  signal,
  untracked,
} from '@angular/core';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-chart',
  template: ` <canvas class="chart"></canvas>`,
  standalone: true,
})
export class ChartComponent {
  chartData = input.required<number[]>();
  chart: Chart | undefined;

  updateDataEffect = effect(() => {
    const value = this.chartData();

    untracked(() => {
      if (this.chart) {
        this.chart.data.datasets[0].data = value;
        this.chart.update()
      }
    });
  });

  constructor() {
    afterNextRender(() => {
      const ctx: HTMLCanvasElement = document.getElementsByClassName(
        'chart',
      )[0] as HTMLCanvasElement;
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Team 1', 'Team 2'],
          datasets: [
            {
              label: 'Ball Possession in %',
              data: this.chartData(),
              borderWidth: 1,
            },
          ],
        },
      });
    });
  }
}
