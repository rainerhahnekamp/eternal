import { fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { HolidaysComponent } from './holidays.component';
import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { holidaysFeature } from '../+state/holidays.reducer';
import { HolidaysEffects } from '../+state/holidays.effects';
import { Configuration } from '@app/shared/config';
import { createHolidays } from '@app/holidays/model';
import { provideHttpClient } from '@angular/common/http';
import { By } from '@angular/platform-browser';

describe('Holidays Component', () => {
  const setup = () =>
    TestBed.configureTestingModule({
      imports: [HolidaysComponent],
      providers: [
        provideStore(),
        provideState(holidaysFeature),
        provideEffects([HolidaysEffects]),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: Configuration,
          useValue: {
            baseUrl: 'http://localhost:8080/',
          },
        },
      ],
    }).createComponent(HolidaysComponent);

  it('should instantiate', waitForAsync(() => {
    const fixture = setup();
    expect(fixture.componentInstance).toBeInstanceOf(HolidaysComponent);
  }));

  it('should show holiday cards', fakeAsync(() => {
    const fixture = setup();
    const controller = TestBed.inject(HttpTestingController);
    const holidays = createHolidays({ title: 'Vienna' }, { title: 'London' });
    controller.expectOne((req) => !!req.url.match(/holiday/)).flush(holidays);

    const cards = fixture.debugElement.queryAll(By.css('app-holiday-card'));
    expect(cards.length).toBe(2);
  }));
});
