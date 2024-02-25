import { Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { DatePipe, isPlatformServer } from '@angular/common';
import { interval } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { Flight } from '@app/holidays/feature/flight';
import { MatButton } from '@angular/material/button';
import { FlightsComponent } from '@app/holidays/feature/flights.component';

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
      <button class="ml-4" mat-raised-button type="submit" color="primary"
        >Search</button
      >
    </form>

    <div> Current Time: {{ lastUpdated() }} </div>
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
  ],
})
export class FlightsContainerComponent {
  flights = signal<Flight[]>([]);

  searchParams = { from: signal('Berlin'), to: signal('London') };
  lastUpdated = signal(new Date().toLocaleTimeString());

  constructor() {
    if (isPlatformServer(inject(PLATFORM_ID))) {
      return;
    }

    interval(1000)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.lastUpdated.set(new Date().toLocaleTimeString()));
  }

  async search() {
    const from = this.searchParams.from();
    const to = this.searchParams.to();
    const response = await fetch(
      'https://demo.angulararchitects.io/api/flight?' +
        new URLSearchParams({ from, to }),
    );

    this.flights.set(await response.json());
  }
}
