import { Location } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { HolidaysEffects } from '../+state/holidays.effects';
import { holidaysFeature } from '../+state/holidays.reducer';
import { RequestInfoComponent } from '../request-info/request-info.component';
import { RequestInfoComponentModule } from '../request-info/request-info.component.module';
import { HolidaysComponent } from './holidays.component';
import { HolidaysComponentModule } from './holidays.component.module';

describe('Holiday Component', () => {
  it('should navigate to the request info component on click', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature(holidaysFeature),
        EffectsModule.forRoot([HolidaysEffects]),
        HolidaysComponentModule,
        HttpClientTestingModule,
        RequestInfoComponentModule,
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
      ],
      providers: [{ provide: MATERIAL_SANITY_CHECKS, useValue: false }]
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
