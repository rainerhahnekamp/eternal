- [1. HttpClientTestingModule](#1-httpclienttestingmodule)
- [2. Routing I](#2-routing-i)
- [3. Full ngrx Test](#3-full-ngrx-test)
- [4. All-in-One Showdown: Integration Test for Holidays](#4-all-in-one-showdown-integration-test-for-holidays)
- [5. Bonus: Routing II](#5-bonus-routing-ii)
- [6. Bonus: No Mock AddressLookup](#6-bonus-no-mock-addresslookup)

# 1. HttpClientTestingModule

Create a unit test that only mocks the `HttpClient`. Everything else, like the AddressLookuper service, will be used.

The test below is missing the code where the `HttpTestingController` steps in. Implement it.

**holidays/request-info/request-info.component.spec.ts**

```typescript
it('should only mock the HttpClient', async () => {
  const fixture = createFixture({
    imports: [...(testModuleMetadata.imports || []), HttpClientTestingModule],
    providers: [noMaterialCheck]
  });
  const controller = TestBed.inject(HttpTestingController);
  const harness = await TestbedHarnessEnvironment.harnessForFixture(
    fixture,
    RequestInfoComponentHarness
  );

  await harness.writeAddress('Domgasse 5');
  await harness.submit();

  // use httpController here

  expect(await harness.getResult()).toBe('Brochure sent');
});
```

<details>
<summary>Show Solution</summary>
<p>

```typescript
controller.expectOne((req) => !!req.url.match(/nominatim/)).flush([true]);
```

</p>
</details>

# 2. Routing I

If the url `/home` is called, the user is redirected to `/`. Let's write a test in `app.component.spec.ts` to verify this.

```typescript
import { Location } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { APP_ROUTES } from './app.routes';
import { UserLoaderGuard } from './core/user-loader.guard';
import { RequestInfoComponent } from './holidays/request-info/request-info.component';
import { HomeComponent } from './home/home.component';

it('should check /home redirects to /', () => {
  const fixture = TestBed.configureTestingModule({
    declarations: [HomeComponent, AppComponent, RequestInfoComponent],
    imports: [RouterTestingModule.withRoutes(APP_ROUTES)],
    providers: [
      {
        provide: UserLoaderGuard,
        useValue: { canActivate: () => true }
      }
    ],
    schemas: [NO_ERRORS_SCHEMA]
  }).createComponent(AppComponent);

  const router = TestBed.inject(Router);
  const location = TestBed.inject(Location);

  router.initialNavigation();
  router.navigateByUrl('/home');
  expect(location.path()).toBe('/');
});
```

# 3. Full ngrx Test

Come up with a test that checks if ngrx is loading the holidays. Only mock the `HttpClient` with the `HttpClientTestingModule`. This makes it a unit test that covers the reducer, effect and selector.

In your testing module you just need to setup ngrx as usually (by importing the StoreModule and EffectsModule). `TestBed.inject` will give you access to the `Store`.

<details>
<summary>Show Solution</summary>
<p>

**holidays/+state/state.spec.ts**

```typescript
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { Store, StoreModule } from '@ngrx/store';
import { holidaysActions } from './holidays.actions';
import { HolidaysEffects } from './holidays.effects';
import { holidaysFeatureKey, holidaysReducer } from './holidays.reducer';
import { fromHolidays } from './holidays.selectors';

describe('Full ngrx Test', () => {
  it(
    'should load holidays',
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          StoreModule.forRoot({ [holidaysFeatureKey]: holidaysReducer }),
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
```

</p>
</details>

# 4. All-in-One Showdown: Integration Test for Holidays

To solve this exercise, you need to apply everything that you have learned so far.

Write an integration tests for the holidays component where you only mock the HttpClient. This means you have to include full state management as well as the holiday card.

The test should verify that a holiday card is shown. When the user clicks on the more info button, verify that the url changes to the predefined url of the `RequestInfoComponent`.

Good luck!

<details>
<summary>Show Solution</summary>
<p>

**holidays/holidays/holidays.component.spec.ts**

```typescript
import { Location } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
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
```

</p>
</details>

# 5. Bonus: Routing II

We should ask our users for permission to store their addresses. This is done in a compnonent which redirects on approval.

1. Let's generate a proper gdpc component. We skip css and inline the template:

```bash
npx ng g c gdpc -it -is
```

2. Our component could look like this:

```typescript
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  template: `
    <p>Do you give your consent that we can collect all your data?</p>
    <button mat-raised-button (click)="consent()">Of Course</button>&nbsp;
    <button mat-raised-button (click)="consent()">Do It</button>
  `
})
export class GdpcComponent {
  public constructor(private router: Router) {}

  consent(): void {
    this.router.navigateByUrl('/home');
  }
}
```

Write a test in London and one in the Detroit style in the generated `gdpc.spec.ts`. Verify that the redirection to home takes place.

<details>
<summary>Show Solution</summary>
<p>

```typescript
import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeComponent } from '../home/home.component';
import { mock } from '../shared/mock';
import { GdpcComponent } from './gdpc.component';

describe('GdpcComponent', () => {
  it('should check confirmation in London-style', () => {
    const router = mock<Router>({
      navigateByUrl: jest.fn()
    });
    new GdpcComponent(router).consent();

    expect(router.navigateByUrl).toBeCalledWith('/home');
  });

  it('should make sure that gdpc confirmation redirects to home', () => {
    const fixture = TestBed.configureTestingModule({
      declarations: [GdpcComponent, HomeComponent],
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: 'gdpc',
            component: GdpcComponent
          },
          {
            path: 'home',
            component: HomeComponent
          }
        ])
      ]
    }).createComponent(GdpcComponent);

    const location = TestBed.inject(Location);
    fixture.detectChanges();
    const consentButton = fixture.debugElement.query(By.css('button'))
      .nativeElement as HTMLButtonElement;
    consentButton.click();
    expect(location.path()).toBe('/home');
  });
});
```

</p>
</details>

# 6. Bonus: No Mock AddressLookup

Just for fun: Try to write a test that search for "Domgasse 5" and mocks nothing. This means, we would do a real request to the nominatim endpoint.

<details>
<summary>Show Solution</summary>
<p>

**shared/address-lookuper.service.spec.ts**

```typescript
it('should do a real request', (done) => {
  const lookuper = TestBed.configureTestingModule({ imports: [HttpClientModule] }).inject(
    AddressLookuper
  );
  lookuper.lookup('Domgasse 5').subscribe((isValid) => {
    expect(isValid).toBe(true);
    done();
  });
});
```

</p>
</details>
