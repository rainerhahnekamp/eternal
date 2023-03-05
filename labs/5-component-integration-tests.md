- [1. Mounting](#1-mounting)
- [2. Add fonts and icons](#2-add-fonts-and-icons)
- [3 Testing an `@Input()`](#3-testing-an-input)
- [4. Add `cy.testid`](#4-add-cytestid)
- [5. Mocking the network via `cy.intercept`](#5-mocking-the-network-via-cyintercept)
- [6. Mocking the `AddressLookuper`](#6-mocking-the-addresslookuper)
- [7. Wrapper Component](#7-wrapper-component)
- [8. Mocking the `HttpClient`](#8-mocking-the-httpclient)

Checkout the branch `lab-5-starter`.

Write a test for the `RequestInfoComponent` by using Cypress' component runner. That feature allows you to test a component in isolation by using all the capabilities of the Cypress framework.

Start Cypress with the configuration for component testing via `npm run test:component-test`

# 1. Mounting

The hardest part is the mounting of the component. Once you have that up and running, you can re-use it in other tests.

Create and add following content to the file **/apps/eternal/src/app/holidays/request-info/request-info.cy.ts**.

Go to Cypress initial screen, click on component testing and run the test. It should be successful, i.e. you should see the rendered component.

<details>
<summary>Show Solution</summary>
<p>

```typescript
import { RequestInfoComponent } from './request-info.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { mount } from 'cypress/angular';
import { asyncScheduler, scheduled } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { provideState, provideStore } from '@ngrx/store';
import { holidaysFeature } from '../+state/holidays.reducer';
import { provideEffects } from '@ngrx/effects';
import { HolidaysEffects } from '../+state/holidays.effects';
import { Configuration } from '../../shared/configuration';
import { createHoliday } from '../model/holiday';

describe('Request Info Component', () => {
  it('should mount', () => {
    const activatedRouter = { paramMap: scheduled([{ get: () => 1 }], asyncScheduler) };
    cy.intercept('/holiday', {
      body: [
        createHoliday({
          title: 'Vienna',
          imageUrl: 'https://api.eternal-holidays.net/holiday/vienna.jpg'
        })
      ]
    });
    mount(RequestInfoComponent, {
      imports: [NoopAnimationsModule],
      providers: [
        provideHttpClient(),
        provideStore(),
        provideState(holidaysFeature),
        provideEffects(HolidaysEffects),
        { provide: ActivatedRoute, useValue: activatedRouter },
        { provide: Configuration, useValue: { baseUrl: 'http://localhost:4200' } }
      ]
    });
  });
});
```

</p>
</details>

# 2. Add fonts and icons

All components are mounted within the **/apps/eternal/cypress/support/component-index.html**.

Copy the tags for the fonts and icons from the application's **index.html**. Make sure that the location icon in the input field of the component is shown correctly.

# 3 Testing an `@Input()`

Write a test with a new `TestBedConfig` where you only mount the `RequestInfoComponent` but use the additional `componentProperties` property to set the address to "Domgasse 5".

Verify that the input field's value is set.

<details>
<summary>Show Solution</summary>
<p>

```typescript
it('should set the address', () => {
  const activatedRouter = { paramMap: scheduled([{ get: () => 1 }], asyncScheduler) };
  cy.intercept('/holiday', {
    body: [
      createHoliday({
        title: 'Vienna',
        imageUrl: 'https://api.eternal-holidays.net/holiday/vienna.jpg'
      })
    ]
  });
  mount(RequestInfoComponent, {
    imports: [NoopAnimationsModule],
    providers: [
      provideHttpClient(),
      provideStore(),
      provideState(holidaysFeature),
      provideEffects(HolidaysEffects),
      { provide: ActivatedRoute, useValue: activatedRouter },
      { provide: Configuration, useValue: { baseUrl: 'http://localhost:4200' } }
    ],
    componentProperties: { address: 'Domgasse 5' }
  });

  cy.get('[data-testid=ri-address]').should('have.value', 'Domgasse 5');
});
```

</p>
</details>

# 4. Add `cy.testid`

Look up the code from the E2E unit and create a `cy.testid` command for the component testing as well.

Apply it also to the **should set the address** test.

# 5. Mocking the network via `cy.intercept`

Write a parameterised test where you test against a valid and a non-valid address. Use `cy.intercept` to mock the network communication.

<details>
<summary>Show Solution</summary>
<p>

```typescript
for (const { message, response } of [
  { message: 'Brochure sent', response: ['address'] },
  { message: 'Address not found', response: [] }
]) {
  it(`should intercept the network and return ${response} for ${message}`, () => {
    const activatedRouter = { paramMap: scheduled([{ get: () => 1 }], asyncScheduler) };

    cy.intercept('/holiday', {
      body: [
        createHoliday({
          title: 'Vienna',
          imageUrl: 'https://api.eternal-holidays.net/holiday/vienna.jpg'
        })
      ]
    });
    cy.intercept(/nominatim/, { body: response });

    mount(RequestInfoComponent, {
      imports: [NoopAnimationsModule],
      providers: [
        provideHttpClient(),
        provideStore(),
        provideState(holidaysFeature),
        provideEffects(HolidaysEffects),
        { provide: ActivatedRoute, useValue: activatedRouter },
        { provide: Configuration, useValue: { baseUrl: 'http://localhost:4200' } }
      ]
    });

    cy.testid('ri-address').type('Domgasse 5');
    cy.testid('ri-search').click();
    cy.testid('ri-message').should('have.text', message);
  });
}
```

</p>
</details>

# 6. Mocking the `AddressLookuper`

Write a test in the same style like the former one but instead of mocking the network via `cy.intercept`, create a manual for the `AddressLookuper`.

<details>
<summary>Show Solution</summary>
<p>

```typescript
for (const { message, response } of [
  { message: 'Brochure sent', response: true },
  { message: 'Address not found', response: false }
]) {
  it(`should mock the AddressLookuper and return ${response} for ${message}`, () => {
    const activatedRouter = { paramMap: scheduled([{ get: () => 1 }], asyncScheduler) };
    const lookuper = { lookup: () => scheduled([response], asyncScheduler) };

    mount(RequestInfoComponent, {
      imports: [NoopAnimationsModule],
      providers: [
        provideHttpClient(),
        provideStore(),
        provideState(holidaysFeature),
        provideEffects(HolidaysEffects),
        { provide: ActivatedRoute, useValue: activatedRouter },
        { provide: Configuration, useValue: { baseUrl: 'http://localhost:4200' } },
        { provide: AddressLookuper, useValue: lookuper }
      ]
    });

    cy.testid('ri-address').type('Domgasse 5');
    cy.testid('ri-search').click();
    cy.testid('ri-message').should('have.text', message);
  });
}
```

</p>
</details>

# 7. Wrapper Component

Write a test, where the `mount` does not get the `RequestInfoComponent` as its first parameter, but the string `<eternal-request-info address="Domgasse 5"></eternal-request-info>`.

Find out the required `TestBed` configuration on your own and verify that the input has the value "Domgasse 5".

<details>
<summary>Show Solution</summary>
<p>

```typescript
it('should use a wrapper component to set the address', () => {
  const activatedRouter = { paramMap: scheduled([{ get: () => 1 }], asyncScheduler) };
  cy.intercept('/holiday', {
    body: [
      createHoliday({
        title: 'Vienna',
        imageUrl: 'https://api.eternal-holidays.net/holiday/vienna.jpg'
      })
    ]
  });
  mount(`<eternal-request-info address="Domgasse 5"></eternal-request-info>`, {
    imports: [NoopAnimationsModule, RequestInfoComponent],
    providers: [
      provideHttpClient(),
      provideStore(),
      provideState(holidaysFeature),
      provideEffects(HolidaysEffects),
      { provide: ActivatedRoute, useValue: activatedRouter },
      { provide: Configuration, useValue: { baseUrl: 'http://localhost:4200' } }
    ]
  });
  cy.testid('ri-address').should('have.value', 'Domgasse 5');
});
```

</p>
</details>

# 8. Mocking the `HttpClient`

Write a test, where you mock the `HttpClient` in the same way, as you did the `AddressLookuper`.

<details>
<summary>Show Solution</summary>
<p>

```typescript
it(`should mock the HttpClient`, () => {
  const httpClient = {
    get: (url: string) => {
      if (url.match(/holiday/)) {
        return of(
          createHoliday({
            title: 'Vienna',
            imageUrl: 'https://api.eternal-holidays.net/holiday/vienna.jpg'
          })
        );
      } else if (url.match(/nominatim/)) {
        return scheduled([[]], asyncScheduler);
      }
      throw `unnknown url: ${url}`;
    }
  };
  const activatedRouter = { paramMap: scheduled([{ get: () => 1 }], asyncScheduler) };

  mount(RequestInfoComponent, {
    imports: [NoopAnimationsModule],
    providers: [
      { provide: HttpClient, useValue: httpClient },
      provideStore(),
      provideState(holidaysFeature),
      provideEffects(HolidaysEffects),
      { provide: ActivatedRoute, useValue: activatedRouter },
      { provide: Configuration, useValue: { baseUrl: 'http://localhost:4200' } }
    ]
  });

  cy.testid('ri-address').type('Domgasse 5');
  cy.testid('ri-search').click();
  cy.testid('ri-message').should('have.text', 'Address not found');
});
```

</p>
</details>
