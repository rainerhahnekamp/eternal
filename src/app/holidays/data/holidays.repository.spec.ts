import { TestBed } from '@angular/core/testing';
import { HolidaysRepository, provideHolidays } from '@app/holidays/data/index';
import { provideStore } from '@ngrx/store';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { Configuration } from '@app/shared/config';
import { createHoliday } from '@app/holidays/model';

describe('Holidays Feature State', () => {
  it('should load the holidays', () => {
    TestBed.configureTestingModule({
      providers: [
        provideStore(),
        provideHolidays(),
        {
          provide: Configuration,
          useValue: new Configuration('https://www.host.com/', true, false),
        },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    const repository = TestBed.inject(HolidaysRepository);
    const ctrl = TestBed.inject(HttpTestingController);
    repository.load();

    const holiday = createHoliday({ imageUrl: 'holiday.jpg' });
    const request = ctrl.expectOne('/holiday');
    request.flush([holiday]);

    expect(repository.holidays()).toEqual([
      { ...holiday, imageUrl: 'https://www.host.com/holiday.jpg' },
    ]);
  });
});
