import { TestBed } from '@angular/core/testing';
import { createFlight, Flight } from '@app/holidays/feature/flight';

import {
  ChangeDetectionStrategy,
  Component,
  createComponent,
} from '@angular/core';
import { FlightsComponent } from '@app/holidays/feature/flights.component';
import { By } from '@angular/platform-browser';
import { FlightsContainerComponent } from '@app/holidays/feature/flights-container.component';
import { CdTrackerDirective } from '@app/holidays/feature/cd-tracker.directive';
import { FlightSearch } from '@app/holidays/feature/flight-search.service';
import { of } from 'rxjs';
import { CdTracker } from '@app/holidays/feature/cd-tracker.service';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

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

  it('should not update flights on mutable changes', () => {
    const { fixture } = setup();

    let rows = fixture.debugElement.queryAll(
      By.css('[data-testid=row-flight]'),
    );

    expect(rows).toHaveSize(2);

    fixture.componentInstance.flights.push(createFlight());
    fixture.detectChanges();
    rows = fixture.debugElement.queryAll(By.css('[data-testid=row-flight]'));
    expect(rows).toHaveSize(2);
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

    expect(cdTracker.getCdCounts('FlightContainer')).not.toBeUndefined();
    expect(cdTracker.getCdCounts('Flights')).not.toBeUndefined();
    cdTracker.reset();
  });
});
