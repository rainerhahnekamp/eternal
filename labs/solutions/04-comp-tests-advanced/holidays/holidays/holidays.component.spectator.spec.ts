import { createRoutingFactory, createSpyObject } from '@ngneat/spectator/jest';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { fromHolidays } from '../+state/holidays.selectors';
import { createHoliday } from '../holiday';
import { HolidaysComponent } from './holidays.component';
import { HolidaysComponentModule } from './holidays.component.module';

describe('Holidays Component', () => {
  const storeMock = createSpyObject(Store);
  const createComponent = createRoutingFactory({
    component: HolidaysComponent,
    imports: [HolidaysComponentModule],
    providers: [{ provide: Store, useValue: storeMock }],
    declareComponent: false
  });

  it('should show a holiday', () => {
    const holiday = createHoliday({ title: 'Vienna' });
    storeMock.select.mockImplementation((selector) => {
      expect(selector).toBe(fromHolidays.get);
      return of([holiday]);
    });

    const spectator = createComponent();

    expect(spectator.query('[data-testid=holiday-1] mat-card-title')).toHaveExactText('Vienna');
  });
});
