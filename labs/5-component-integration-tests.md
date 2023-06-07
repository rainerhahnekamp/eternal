- [1. Mounting](#1-mounting)
- [2. Add fonts and icons](#2-add-fonts-and-icons)
- [3 Testing an `@Input()`](#3-testing-an-input)
- [4. Add `cy.testid`](#4-add-cytestid)
- [5. Mocking the network via `cy.intercept`](#5-mocking-the-network-via-cyintercept)
- [6. Mocking the `AddressLookuper`](#6-mocking-the-addresslookuper)
- [7. Wrapper Component](#7-wrapper-component)
- [8. Mocking the `HttpClient`](#8-mocking-the-httpclient)

Checkout the branch `starter-05-component-integration-tests`.

Write a test for the `RequestInfoComponent` by using Cypress' component runner. That feature allows you to test a component in isolation by using all the capabilities of the Cypress framework.

Start Cypress with the configuration for component testing via `npm run component-test:watch`

# 1. Mounting

The hardest part is the mounting of the component. Once you have that up and running, you can re-use it in other tests.

Create and add following content to the file **/src/app/holidays/request-info/request-info.cy.ts**.

Go to Cypress initial screen, click on component testing and run the test. It should be successful, i.e. you should see the rendered component.

<details>
<summary>Show Solution</summary>
<p>

```typescript
import { RequestInfoComponent } from './request-info.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { mount } from 'cypress/angular';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideHolidays } from '@app/holidays/+state';
import { Configuration } from '@app/shared';

describe('Request Info Component', () => {
  it('should mount', () => {
    mount(RequestInfoComponent, {
      imports: [NoopAnimationsModule],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        provideStore(),
        provideHolidays,
        {
          provide: Configuration,
          useValue: { baseUrl: 'http://localhost:4200' },
        },
      ],
    });
  });
});
```

</p>
</details>

# 2. Add fonts and icons

All components are mounted within the **/cypress/support/component-index.html**.

Copy the tags for the fonts and icons from the application's **index.html**. Make sure that the location icon in the input field of the component is shown correctly.

# 3 Testing an `@Input()`

Update the test, where you mount the `RequestInfoComponent` with an additional `componentProperties` property. It should set the address property's value to "Domgasse 5".

Verify that the input field's value is set.

<details>
<summary>Show Solution</summary>
<p>

```typescript
it('should mount', () => {
  mount(RequestInfoComponent, {
    imports: [NoopAnimationsModule],
    providers: [
      provideHttpClient(),
      provideRouter([]),
      provideStore(),
      provideHolidays,
      {
        provide: Configuration,
        useValue: { baseUrl: 'http://localhost:4200' },
      },
    ],
    componentProperties: { address: 'Domgasse 5' },
  });

  cy.get('[data-testid=ri-address]').should('have.value', 'Domgasse 5');
});
```

</p>
</details>

# 4. Add `cy.testid`

Look up the code from the E2E unit and create a `cy.testid` command for the component testing as well.

The file is **/cypress/support/component.ts**.

Use it in your test.

It might be possible that your IDE doesn't identify the command.

<details>
<summary>Show Solution</summary>
<p>

**/cypress/support/component.ts**

```typescript
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable<Subject> {
      mount: typeof mount;
      testid: JQuery<HTMLElement>;
    }
  }
}

Cypress.Commands.add('mount', mount);
Cypress.Commands.addQuery('testid', (testid: string) => {
  const getFn = cy.now('get', `[data-testid=${testid}]`) as () => JQuery<HTMLElement>;
  return () => getFn();
});
```

</p>
</details>

# 5. Mocking the network via `cy.intercept`

Upgrade your test to a parameterised one, where you test against a valid and a non-valid address. Use `cy.intercept` to mock the network communication.

<details>
<summary>Show Solution</summary>
<p>

```typescript
for (const { message, response } of [
  { message: 'Brochure sent', response: ['address'] },
  { message: 'Address not found', response: [] },
]) {
  it(`should intercept the network and return ${response} for ${message}`, () => {
    cy.intercept(/nominatim/, { body: response });

    mount(RequestInfoComponent, {
      imports: [NoopAnimationsModule],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        provideStore(),
        provideHolidays,
        {
          provide: Configuration,
          useValue: { baseUrl: 'http://localhost:4200' },
        },
      ],
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

Modify the test. It should not mock the network via `cy.intercept`, but should replace the `AddressLookuper`.

<details>
<summary>Show Solution</summary>
<p>

```typescript
for (const { message, response } of [
  { message: 'Brochure sent', response: true },
  { message: 'Address not found', response: false },
]) {
  it(`should intercept the network and return ${response} for ${message}`, () => {
    const lookuper = { lookup: () => scheduled([response], asyncScheduler) };

    mount(RequestInfoComponent, {
      imports: [NoopAnimationsModule],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        provideStore(),
        provideHolidays,
        {
          provide: Configuration,
          useValue: { baseUrl: 'http://localhost:4200' },
        },
        { provide: AddressLookuper, useValue: lookuper },
      ],
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

Now change the `mount` command, so that it does not pass the `RequestInfoComponent` as its first parameter, but the string `<eternal-request-info address="Domgasse 5"></eternal-request-info>`.

Find out the required `TestBed` configuration on your own and verify that the input has the value "Domgasse 5".

<details>
<summary>Show Solution</summary>
<p>

```typescript
for (const { message, response } of [
  { message: 'Brochure sent', response: true },
  { message: 'Address not found', response: false },
]) {
  it(`should intercept the network and return ${response} for ${message}`, () => {
    const lookuper = { lookup: () => scheduled([response], asyncScheduler) };

    mount(`<app-request-info address="Domgasse 5" />`, {
      imports: [RequestInfoComponent, NoopAnimationsModule],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        provideStore(),
        provideHolidays,
        {
          provide: Configuration,
          useValue: { baseUrl: 'http://localhost:4200' },
        },
        { provide: AddressLookuper, useValue: lookuper },
      ],
    });

    cy.testid('ri-address').should('have.value', 'Domgasse 5');
    cy.testid('ri-search').click();
    cy.testid('ri-message').should('have.text', message);
  });
}
```

</p>
</details>

# 8. Mocking the `HttpClient`

Update your test again. This you don't mock the `AddressLookuper` but the `HttpClient`.

<details>
<summary>Show Solution</summary>
<p>

```typescript
for (const { message, response } of [
  { message: 'Brochure sent', response: [true] },
  { message: 'Address not found', response: [] },
]) {
  it(`should intercept the network and return ${response} for ${message}`, () => {
    const httpClient = { get: () => scheduled([response], asyncScheduler) };

    mount(`<app-request-info address="Domgasse 5" />`, {
      imports: [RequestInfoComponent, NoopAnimationsModule],
      providers: [
        provideRouter([]),
        provideStore(),
        provideHolidays,
        {
          provide: Configuration,
          useValue: { baseUrl: 'http://localhost:4200' },
        },
        { provide: HttpClient, useValue: httpClient },
      ],
    });

    cy.testid('ri-address').should('have.value', 'Domgasse 5');
    cy.testid('ri-search').click();
    cy.testid('ri-message').should('have.text', message);
  });
}
```

</p>
</details>
