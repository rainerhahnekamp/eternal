import { holidaysActions } from './holidays.actions';
import { HolidaysEffects } from './holidays.effects';
import { marbles } from 'rxjs-marbles/jest';
import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { Configuration } from '@app/shared/config';
import { createHolidays } from '@app/holidays/model';

it(
  'should test load$',
  marbles((m) => {
    const httpClient = {
      get: () =>
        m.cold('---a', {
          a: createHolidays({ id: 1, imageUrl: '/pyramids.jpg' }),
        }),
    };
    const actions$ = m.cold('a', { a: holidaysActions.load() });

    const effect = TestBed.configureTestingModule({
      providers: [
        HolidaysEffects,
        { provide: Actions, useValue: actions$ },
        { provide: HttpClient, useValue: httpClient },
        {
          provide: Configuration,
          useValue: { baseUrl: 'http://api.eternal-holidays.net' },
        },
      ],
    }).inject(HolidaysEffects);

    m.expect(effect.load$).toBeObservable('3ms a', {
      a: holidaysActions.loaded({
        holidays: createHolidays({
          id: 1,
          imageUrl: 'http://api.eternal-holidays.net/pyramids.jpg',
        }),
      }),
    });
  }),
);
