import { it, expect, describe, vitest } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideLocationMocks } from '@angular/common/testing';
import { provideRouter } from '@angular/router';
import { HolidaysPage } from './holidays-page';
import { RouterTestingHarness } from '@angular/router/testing';
import { createHolidays } from './holiday';
import { page, userEvent } from 'vitest/browser';

describe('integration test for holidays', () => {
  it('should show 2 holidays', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClientTesting(),
        provideLocationMocks(),
        provideRouter([
          {
            path: 'holidays',
            component: HolidaysPage,
          },
        ]),
      ],
    });

    await RouterTestingHarness.create('holidays');
    const ctrl = TestBed.inject(HttpTestingController);
    const holidays = createHolidays({ title: 'Hamburg' }, { title: 'London' });
    ctrl.expectOne('/holiday?query=').flush(holidays);

    await expect.element(page.getByTestId('holiday-card')).toHaveLength(2);

    await userEvent.type(page.getByRole('textbox', { name: 'Search' }), 'H');
    ctrl.expectOne('/holiday?query=H').flush(holidays);
    await expect.element(page.getByTestId('holiday-card')).toHaveLength(1);
  });

  it.only('should show 2 holidays with fake timers', async () => {
    vitest.useFakeTimers();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClientTesting(),
        provideLocationMocks(),
        provideRouter([
          {
            path: 'holidays',
            component: HolidaysPage,
          },
        ]),
      ],
    });

    await RouterTestingHarness.create('holidays');
    const ctrl = TestBed.inject(HttpTestingController);
    const holidays = createHolidays({ title: 'Hamburg' }, { title: 'London' });
    ctrl.expectOne('/holiday?query=').flush(holidays);

    await expect.element(page.getByTestId('holiday-card')).toHaveLength(2);

    await userEvent.type(page.getByRole('textbox', { name: 'Search' }), 'H');

    // await vitest.runAllTimersAsync();
    ctrl.expectOne('/holiday?query=H').flush(holidays);
    await expect.element(page.getByTestId('holiday-card')).toHaveLength(1);
  });
});
