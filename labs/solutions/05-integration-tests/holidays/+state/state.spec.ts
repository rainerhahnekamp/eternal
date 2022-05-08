import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { Store, StoreModule } from '@ngrx/store';
import { holidaysActions } from './holidays.actions';
import { HolidaysEffects } from './holidays.effects';
import { holidaysFeature } from './holidays.reducer';
import { fromHolidays } from './holidays.selectors';

describe('Full NgRx Test', () => {
  it(
    'should load holidays',
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          StoreModule.forRoot({}),
          StoreModule.forFeature(holidaysFeature),
          EffectsModule.forRoot([HolidaysEffects]),
          HttpClientTestingModule
        ]
      });

      const store = TestBed.inject(Store);
      const controller = TestBed.inject(HttpTestingController);
      store.dispatch(holidaysActions.findHolidays());

      const [request] = controller.match((req) => req.url.includes('/holiday'));
      request.flush([
        { id: 1, title: 'Mountains' },
        { id: 2, title: 'Ocean' }
      ]);

      store.select(fromHolidays.get).subscribe((holidays) => expect(holidays).toHaveLength(2));
    })
  );
});
