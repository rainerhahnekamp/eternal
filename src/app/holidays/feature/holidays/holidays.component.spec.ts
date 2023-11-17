import { fakeAsync, TestBed } from '@angular/core/testing';
import { render, screen } from '@testing-library/angular';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { HolidaysComponent } from './holidays.component';
import { provideStore } from '@ngrx/store';
import { Configuration } from '@app/shared/config';
import { createHolidays } from '@app/holidays/model';
import { provideHttpClient } from '@angular/common/http';
import { provideHolidays } from '@app/holidays/data';

xdescribe('Holidays Component', () => {
  const setup = async () =>
    render(HolidaysComponent, {
      providers: [
        provideStore(),
        provideHolidays(),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: Configuration,
          useValue: {
            baseUrl: 'http://localhost:8080/',
          },
        },
      ],
      excludeComponentDeclaration: true,
    });

  it('should instantiate', fakeAsync(async () => {
    await setup();
    await screen.findByText('Choose among our Holidays');
  }));

  it('should show holiday cards', fakeAsync(async () => {
    await setup();
    const controller = TestBed.inject(HttpTestingController);
    const holidays = createHolidays({ title: 'Vienna' }, { title: 'London' });
    controller.expectOne((req) => !!req.url.match(/holiday/)).flush(holidays);

    await screen.findByText('Vienna');
    await screen.findByText('London');
  }));
});
