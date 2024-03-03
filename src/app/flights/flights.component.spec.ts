import { TestBed } from '@angular/core/testing';

import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Component } from '@angular/core';
import { FlightsComponent } from './flights.component';
import { Flight, createFlight } from './flight';
import FlightsContainerComponent from './flights-container.component';
import { CdTrackerDirective } from '@app/holidays/feature/cd-tracker.directive';
import { FlightSearch } from '@app/flights/flight-search.service';
import { CdTracker } from '@app/holidays/feature/cd-tracker.service';

@Component({
  template: ` <app-flights [flights]="flights" />`,
  imports: [FlightsComponent],
  standalone: true,
})
export class WrapperComponent {
  flights: Flight[] = [createFlight(), createFlight()];
}

describe('Flights', () => {
  const setup = () => {
    const fixture = TestBed.configureTestingModule({
      imports: [WrapperComponent],
    }).createComponent(WrapperComponent);
    fixture.detectChanges();

    return { fixture };
  };

  it('should update flights on immutable changes', () => {
    const { fixture } = setup();
    let rows = fixture.debugElement.queryAll(
      By.css('[data-testid=row-flight]'),
    );

    expect(rows).toHaveSize(2);

    fixture.componentInstance.flights = [
      createFlight(),
      createFlight(),
      createFlight(),
    ];
    fixture.detectChanges();
    rows = fixture.debugElement.queryAll(By.css('[data-testid=row-flight]'));
    expect(rows).toHaveSize(3);
  });

  it('should do local change detection', () => {
    [FlightsContainerComponent, FlightsComponent].forEach((Component) =>
      TestBed.overrideComponent(Component, {
        add: { imports: [CdTrackerDirective] },
      }),
    );
    const fixture = TestBed.configureTestingModule({
      imports: [FlightsContainerComponent],
      providers: [
        provideNoopAnimations(),
        { provide: FlightSearch, useValue: of([createFlight()]) },
      ],
    }).createComponent(FlightsContainerComponent);
    const cdTracker = TestBed.inject(CdTracker);
    fixture.detectChanges();

    fixture.debugElement
      .query(By.css('[data-testid=btn-search]'))
      .nativeElement.click();

    // expect(cdTracker.getCdCounts('FlightContainer')).not.toBeUndefined();
    // expect(cdTracker.getCdCounts('Flights')).not.toBeUndefined();
    cdTracker.reset();
  });
});
