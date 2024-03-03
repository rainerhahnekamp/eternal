import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { Flight } from './flight';
import { interval } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { CdTrackerDirective } from '@app/holidays/feature/cd-tracker.directive';

@Component({
  selector: 'app-flights',
  template: `
    <div class="my-4 max-w-screen-sm" data-cd-tracker="Flights">
      @if (flights().length) {
        <table class="table-auto">
          <thead>
            <th class="px-4">ID</th>
            <th class="px-4">From</th>
            <th class="px-4">To</th>
            <th class="px-4">Date</th>
            <th class="px-4">Delayed</th>
            <th class="px-4">&nbsp;</th>
          </thead>

          <tbody>
            @for (flight of flights(); track flight) {
              <tr data-testid="row-flight">
                <td class="px-4">{{ flight.id }}</td>
                <td class="px-4">{{ flight.from }}</td>
                <td class="px-4">{{ flight.to }}</td>
                <td class="px-4">{{ flight.date }}</td>
                <td class="px-4">{{ flight.delayed }}</td>
              </tr>
            }
          </tbody>
        </table>
      } @else {
        <p>There are no flights for your search available.</p>
      }
      <p>Last updated: {{ lastUpdated() }}</p>
    </div>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CdTrackerDirective],
})
export class FlightsComponent {
  flights = input.required<Flight[]>();
  lastUpdated = signal(new Date().toLocaleTimeString());

  constructor() {
    interval(1000)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.lastUpdated.set(new Date().toLocaleTimeString()));
  }
}
