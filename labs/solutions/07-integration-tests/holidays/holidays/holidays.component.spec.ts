import { Location } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { HolidaysEffects } from '../+state/holidays.effects';
import { holidaysFeatureKey, holidaysReducer } from '../+state/holidays.reducer';
import { HolidayCardComponent } from '../holiday-card/holiday-card.component';
import { RequestInfoComponent } from '../request-info/request-info.component';
import { HolidaysComponent } from './holidays.component';

describe('Holiday Component', () => {
  it('should navigate to the request info component on click', () => {
    const fixture = TestBed.configureTestingModule({
      declarations: [HolidayCardComponent, HolidaysComponent, RequestInfoComponent],
      imports: [
        StoreModule.forRoot({ [holidaysFeatureKey]: holidaysReducer }),
        EffectsModule.forRoot([HolidaysEffects]),
        HttpClientTestingModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatCardModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          {
            path: '',
            component: HolidaysComponent
          },
          {
            path: 'request-info/:holidayId',
            component: RequestInfoComponent
          }
        ])
      ]
    }).createComponent(HolidaysComponent);

    const controller = TestBed.inject(HttpTestingController);
    const location = TestBed.inject(Location);
    fixture.detectChanges();
    const [request] = controller.match((req) => req.url.includes('/holiday'));
    request.flush([{ id: 1, title: 'Mountains' }]);
    fixture.detectChanges();
    const link = fixture.debugElement.query(By.css('app-holiday-card a'))
      .nativeElement as HTMLLinkElement;
    link.click();

    expect(location.path()).toBe('/request-info/1');
  });
});
