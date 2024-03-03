import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { Flight } from '@app/holidays/feature/flight';
import { MatButton } from '@angular/material/button';
import { FlightsComponent } from '@app/holidays/feature/flights.component';
import { FlightSearch } from '@app/holidays/feature/flight-search.service';
import { CdTrackerDirective } from '@app/holidays/feature/cd-tracker.directive';

@Component({
  selector: 'app-flights-container',
  template: ` <div data-cd-tracker="FlightsContainer">
    <form (ngSubmit)="search()">
      <mat-form-field>
        <mat-label>From</mat-label>
        <input
          data-testid="inp-from"
          [(ngModel)]="searchParams.from"
          name="from"
          matInput
        />
        <mat-icon matSuffix>location_on</mat-icon>
        <mat-hint>Departure</mat-hint>
      </mat-form-field>
      <mat-form-field>
        <mat-label>To</mat-label>
        <input
          data-testid="inp-address"
          [(ngModel)]="searchParams.to"
          name="to"
          matInput
        />
        <mat-icon matSuffix>location_on</mat-icon>
        <mat-hint>Destination</mat-hint>
      </mat-form-field>
      <button
        class="ml-4"
        mat-raised-button
        type="submit"
        color="primary"
        data-testid="btn-search"
      >
        Search
      </button>
    </form>

    <app-flights [flights]="flights()" />
  </div>`,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatHint,
    MatIcon,
    MatInput,
    MatLabel,
    FormsModule,
    MatButton,
    DatePipe,
    FlightsComponent,
    CdTrackerDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlightsContainerComponent {
  flights = signal<Flight[]>([]);
  flightSearch = inject(FlightSearch);
  searchParams = { from: signal('Berlin'), to: signal('London') };

  async search() {
    this.flights.set(await this.flightSearch.search());
  }
}
