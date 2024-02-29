import { TestBed } from '@angular/core/testing';
import { createFlight, Flight } from '@app/holidays/feature/flight';

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FlightsComponent } from '@app/holidays/feature/flights.component';
import { By } from '@angular/platform-browser';

@Component({
  template: ` <app-flights [flights]="flights" />`,
  imports: [FlightsComponent],
  standalone: true,
})
export class WrapperComponent {
  flights: Flight[] = [createFlight(), createFlight()];
}

fdescribe('Flights', () => {
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
});
