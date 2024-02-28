import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Input,
  input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { Flight } from './flight';

@Component({
  selector: 'app-flights',
  template: `
    <div class="my-4 max-w-screen-sm" data-cd-tracker="FlightsComponent">
      <table>
        <thead>
          <tr>ID</tr>
          <tr>From</tr>
          <tr>To</tr>
          <tr>Date</tr>
          <tr>Delayed</tr>
        </thead>
      </table>

      @if (flights.length) {
        @for (flight of flights; track flight) {
          <tr data-testid="row-flight">
            <td>{{ flight.id }}</td>
            <td>{{ flight.from }}</td>
            <td>{{ flight.to }}</td>
            <td>{{ flight.date }}</td>
            <td>{{ flight.delayed }}</td>
          </tr>
        }
      } @else {
        <p>There are no flights for your search available.</p>
      }
    </div>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlightsComponent {
  @Input() flights: Flight[] = [];
}
