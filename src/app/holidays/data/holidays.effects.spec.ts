import { Actions } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Configuration } from '@app/shared/config';
import { createSpyFromClass } from 'jasmine-auto-spies';
import { TestBed } from '@angular/core/testing';
import { HolidaysEffects } from '@app/holidays/data/holidays.effects';
import { lastValueFrom, of } from 'rxjs';
import { holidaysActions } from '@app/holidays/data/holidays.actions';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

describe('Holidays Effects', () => {
  const setup = (actions$: Actions, httpClientMock?: unknown) => {
    const httpClient = httpClientMock ?? createSpyFromClass(HttpClient);
    const config = createSpyFromClass(Configuration);
    const store = createSpyFromClass(Store);

    const effects = TestBed.configureTestingModule({
      providers: [
        HolidaysEffects,
        { provide: Actions, useValue: actions$ },
        { provide: HttpClient, useValue: httpClient },
        { provide: Configuration, useValue: config },
        // { provide: Store, useValue: store },
        provideMockStore({
          initialState: { holidays: { loadStatus: 'not loaded' } },
        }),
      ],
    }).inject(HolidaysEffects);

    return { httpClient, config, effects, store };
  };

  it('should instantiate', () => {
    const { effects } = setup(of());
    expect(effects).toBeDefined();
  });

  it('get should trigger load is status is not-loaded', async () => {
    const { effects } = setup(of(holidaysActions.get()));
    // store.select.and.returnValue(of('not loaded'));
    await lastValueFrom(effects.get$);
  });
});
