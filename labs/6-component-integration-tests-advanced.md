- [1.Component/Integration Tests "Angular-natively"](#1componentintegration-tests-angular-natively)
  - [1.1. Component Test](#11-component-test)
  - [1.2. Integration Test](#12-integration-test)
- [2. Spectator](#2-spectator)
  - [2.1 Setup TestingModule](#21-setup-testingmodule)
  - [2.2 Mocked AddressLookuper](#22-mocked-addresslookuper)
  - [2.3 Integration test](#23-integration-test)
- [3. Testing Library](#3-testing-library)
  - [3.1. Setup](#31-setup)
  - [3.2. Component Test](#32-component-test)
  - [3.3. Integration Test](#33-integration-test)
- [4. Harnesses](#4-harnesses)
  - [4.1 RequestInfoComponentHarness](#41-requestinfocomponentharness)
  - [4.2. Reusing Material Harnesses](#42-reusing-material-harnesses)
  - [4.3: Harness with multiple elements](#43-harness-with-multiple-elements)

Double-check, that the `RequestInfoComponent` uses the `AddressLookuper`. If not, merge from the `solution` branch or inject it on your own.

# 1.Component/Integration Tests "Angular-natively"

## 1.1. Component Test

Write a component test for the `RequestInfoComponent`. Mock the lookuper so that it only returns `true` when the user's input is "Domgasse 5".

For positive address lookups, the message should say "Brochure sent".

Place this test into a new file: **holidays/request-info/request-info.component.spec.ts**

<details>
<summary>Show Solution</summary>
<p>

```typescript
import { fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { asyncScheduler, scheduled } from 'rxjs';
import { AddressLookuper } from '../../shared/address-lookuper.service';
import { assertType } from '../../shared/assert-type';
import { RequestInfoComponent } from './request-info.component';
import { RequestInfoComponentModule } from './request-info.component.module';

describe('Request Info Component', () => {
  it('should find an address', fakeAsync(() => {
    const lookuper = {
      lookup: (query: string) => scheduled([query === 'Domgasse 5'], asyncScheduler)
    };
    const fixture = TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, RequestInfoComponentModule],
      providers: [{ provide: AddressLookuper, useValue: lookuper }]
    }).createComponent(RequestInfoComponent);
    const input = fixture.debugElement.query(By.css('[data-testid=ri-address]'))
      .nativeElement as HTMLInputElement;
    const button = fixture.debugElement.query(By.css('[data-testid=ri-search]'))
      .nativeElement as HTMLButtonElement;

    fixture.detectChanges();

    input.value = 'Domgasse 5';
    input.dispatchEvent(new Event('input'));
    button.click();
    tick();
    fixture.detectChanges();

    const lookupResult = fixture.debugElement.query(By.css('[data-testid=ri-message]'))
      .nativeElement as HTMLButtonElement;
    expect(lookupResult.textContent).toContain('Brochure sent');
  }));
});
```

</p>
</details>

## 1.2. Integration Test

Add an integration where you don't mock the `AddressLookuper`, but only the `HttpClient`. Use the `HttpClientTestingModule` for that.

<details>
<summary>Show Solution</summary>
<p>

**holidays/request-info/request-info.component.spec.ts**

```typescript
it('should do an integration test for Domgasse 5', fakeAsync(() => {
  const fixture = TestBed.configureTestingModule({
    imports: [NoopAnimationsModule, RequestInfoComponentModule, HttpClientTestingModule]
  }).createComponent(RequestInfoComponent);
  const input = fixture.debugElement.query(By.css('[data-testid=ri-address]'))
    .nativeElement as HTMLInputElement;
  const button = fixture.debugElement.query(By.css('[data-testid=ri-search]'))
    .nativeElement as HTMLButtonElement;

  fixture.detectChanges();

  input.value = 'Domgasse 5';
  input.dispatchEvent(new Event('input'));
  button.click();
  TestBed.inject(HttpTestingController)
    .expectOne((req) => !!req.url.match(/nominatim/))
    .flush([true]);
  tick();
  fixture.detectChanges();

  const lookupResult = fixture.debugElement.query(By.css('[data-testid=ri-message]'))
    .nativeElement as HTMLButtonElement;
  expect(lookupResult.textContent).toContain('Brochure sent');
}));
```

</p>
</details>

# 2. Spectator

## 2.1 Setup TestingModule

Create a new file **request-info.component.spectator.spec.ts** and add the following:

```typescript
import { createComponentFactory } from '@ngneat/spectator/jest';
import { AddressLookuper } from '../../shared/address-lookuper.service';
import { RequestInfoComponent } from './request-info.component';
import { RequestInfoComponentModule } from './request-info.component.module';

describe('Request Info Spectator', () => {
  const createComponent = createComponentFactory({
    component: RequestInfoComponent,
    mocks: [AddressLookuper]
  });

  const setup = () => {
    const spectator = createComponent();
    const lookuperMock = spectator.inject(AddressLookuper);
    return { spectator, lookuperMock };
  };

  const inputSelector = '[data-testid=ri-address]';
  const buttonSelector = '[data-testid=ri-search]';
  const lookupSelector = '[data-testid=ri-message]';

  it('should instantiate', () => {
    const { spectator } = setup();
    expect(spectator.component).toBeInstanceOf(RequestInfoComponent);
  });
});
```

## 2.2 Mocked AddressLookuper

Add the a new test "should find an address" which is the equivalent of the one in **request-info.component.spec.ts**. Do a paramterized tests where you test both "Domgasse 5" and "Domgasse 15".

```typescript
it.each([
  { input: 'Domgasse 5', message: 'Brochure sent' },
  { input: 'Domgasse 15', message: 'Address not found' }
])('should show $message for $input', ({ input, message }) =>
  fakeAsync(() => {
    const { spectator, lookuperMock } = setup();

    lookuperMock.lookup.mockImplementation((query) =>
      scheduled([query === 'Domgasse 5'], asyncScheduler)
    );

    spectator.typeInElement(input, inputSelector);
    spectator.click(buttonSelector);
    spectator.tick();
    const messageBox = spectator.query(lookupSelector);
    expect(messageBox).toHaveText(message);
  })()
);
```

## 2.3 Integration test

Use Spectator for an integration test that only mocks the HttpClient but uses the `AddressLookuper` along `parseAddress`. It should again check against "Domgasse 5" and "Domgasse 15".

We require another `createComponentFactory`. Let's apply the test context strategy. Create a nested test suite by inserting `describe("Component Test", () => {...})` into the existing `describe` method and move all existing code, except the selector variables, inside it.

Then insert a second test suite that contains the test and configuration for the integration test:

```typescript
describe('Request Info Spectator', () => {
  const inputSelector = '[data-testid=ri-address]';
  const buttonSelector = '[data-testid=ri-search]';
  const lookupSelector = '[data-testid=ri-message]';

  describe('Component Test', () => {
    // ...
  });

  describe('Integration Test', () => {
    const createComponent = createComponentFactory({
      component: RequestInfoComponent,
      imports: [HttpClientTestingModule]
    });

    it('should instantiate', () => {
      const spectator = createComponent();
      expect(spectator.component).toBeInstanceOf(RequestInfoComponent);
    });

    it.each([
      { input: 'Domgasse 5', message: 'Brochure sent', response: [true] },
      { input: 'Domgasse 15', message: 'Address not found', response: [] }
    ])('should show $message for $input', ({ input, message, response }) =>
      fakeAsync(() => {
        const spectator = createComponent();
        spectator.typeInElement(input, inputSelector);
        spectator.click(buttonSelector);

        spectator
          .inject(HttpTestingController)
          .expectOne((req) => !!req.url.match(/nominatim/))
          .flush(response);

        spectator.detectChanges();
        expect(spectator.query(lookupSelector)).toHaveText(message);
      })()
    );
  });
});
```

# 3. Testing Library

## 3.1. Setup

Setup a test suite which uses the testing library for the `RequestInfoComponent`.

Name the test file **request-info.component.tl.spec.ts**.

```typescript
describe('Request Info with Testing Library', () => {
  const setup = async () => {
    const renderResult = await render(RequestInfoComponent, {
      providers: [provideMock(AddressLookuper)]
    });
    const user = userEvent.setup();

    return { ...renderResult, user };
  };

  it('should instantiate', async () => {
    const renderResult = await setup();
    expect(renderResult.fixture.componentInstance).toBeInstanceOf(RequestInfoComponent);
  });
});
```

## 3.2. Component Test

Write a parameterized component test, where you mock the `AddressLookuper`.

```typescript
it.each([
  { input: 'Domgasse 5', message: 'Brochure sent' },
  { input: 'Domgasse 15', message: 'Address not found' }
])('should show $message for $input', async ({ input, message }) => {
  const { user } = await setup();
  const lookuper = TestBed.inject(AddressLookuper);
  jest
    .spyOn(lookuper, 'lookup')
    .mockImplementation((query) => scheduled([query === 'Domgasse 5'], asyncScheduler));

  await user.type(screen.getByTestId('ri-address'), input);
  await user.click(screen.getByTestId('ri-search'));

  expect(await screen.findByText(message)).toBeTruthy();
});
```

## 3.3. Integration Test

Write an integration test that only mocks the HttpClient. It should again check against "Domgasse 5" and "Domgasse 15".

Let's apply the test context strategy. Create a nested test suite by inserting `describe("Component Test", () => {...})` into the existing `describe` method and move all existing code, except the selector variables, inside it.

Then insert a second test suite that contains the test and configuration for the integration test:

```typescript
describe('Request Info with Testing Library', () => {
  describe('Component Test', () => {
    //...
  });

  describe('Integration Test', () => {
    const setup = async () => {
      const renderResult = await render(RequestInfoComponent, {
        imports: [HttpClientTestingModule]
      });
      const user = userEvent.setup();

      return { ...renderResult, user };
    };

    it('should instantiate', async () => {
      const renderResult = await setup();
      expect(renderResult.fixture.componentInstance).toBeInstanceOf(RequestInfoComponent);
    });

    it.each([
      { input: 'Domgasse 5', message: 'Brochure sent', response: [true] },
      { input: 'Domgasse 15', message: 'Address not found', response: [] }
    ])('should show $message for $input', async ({ input, message, response }) => {
      const { user } = await setup();

      await user.type(screen.getByTestId('ri-address'), input);
      await user.click(screen.getByTestId('ri-search'));

      TestBed.inject(HttpTestingController)
        .expectOne((req) => !!req.url.match(/nominatim/))
        .flush(response);

      expect(await screen.findByText(message)).toBeTruthy();
    });
  });
});
```

# 4. Harnesses

## 4.1 RequestInfoComponentHarness

Create a harness for the request info component.

**request-info.component.harness.ts**

```typescript
import { ComponentHarness } from '@angular/cdk/testing';

export class RequestInfoComponentHarness extends ComponentHarness {
  static hostSelector = 'eternal-request-info';
  protected getInput = this.locatorFor('[data-testid=ri-address]');
  protected getButton = this.locatorFor('[data-testid=ri-search]');
  protected getLookupResult = this.locatorFor('[data-testid=ri-message]');

  async search(): Promise<void> {
    const button = await this.getButton();
    return button.click();
  }

  async writeAddress(address: string): Promise<void> {
    const input = await this.getInput();
    await input.clear();
    return input.sendKeys(address);
  }

  async getResult(): Promise<string> {
    const p = await this.getLookupResult();
    return p.text();
  }
}
```

Use the harness to write the test "should find an address" in **request-info.component.harness.spec.ts**.

```typescript
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { asyncScheduler, scheduled } from 'rxjs';
import { AddressLookuper } from '../../shared/address-lookuper.service';
import { RequestInfoComponent } from './request-info.component';
import { RequestInfoComponentHarness } from './request-info.component.harness';

describe('Request Info Component', () => {
  it('should find an address', async () => {
    const lookuper = {
      lookup: (query: string) => scheduled([query === 'Domgasse 5'], asyncScheduler)
    };
    const fixture = TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, RequestInfoComponent],
      providers: [{ provide: AddressLookuper, useValue: lookuper }]
    }).createComponent(RequestInfoComponent);
    const harness = await TestbedHarnessEnvironment.harnessForFixture(
      fixture,
      RequestInfoComponentHarness
    );

    // use harness here to set the queries and submit
  });
});
```

<details>
<summary>Show Solution</summary>
<p>

With test harness, the search is very simple. You need to insert following code.

```typescript
await harness.writeAddress('Domgasse 5');
await harness.search();
expect(await harness.getResult()).toBe('Brochure sent');
```

</p>
</details>

## 4.2. Reusing Material Harnesses

Our harness can access its sub-components via harnesses, if these components provide them. We are lucky. Angular Material provides harnesses for all its components.

Inside your harness, change the selector for the input and the button component. You just need to pass the Type inside the `locatorFor` method. That would be `MatInputHarness` and `MatButtonHarness`.

You will also have to update the `writeAddress` method. Turns out that it supports the clearing of the fields internally.

<details>
<summary>Show Solution</summary>
<p>

```typescript
import { ComponentHarness } from '@angular/cdk/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatInputHarness } from '@angular/material/input/testing';

export class RequestInfoComponentHarness extends ComponentHarness {
  static hostSelector = 'eternal-request-info';
  protected getInput = this.locatorFor(MatInputHarness);
  protected getButton = this.locatorFor(MatButtonHarness);
  protected getLookupResult = this.locatorFor('[data-testid=ri-message]');

  async search(): Promise<void> {
    const button = await this.getButton();
    return button.click();
  }

  async writeAddress(address: string): Promise<void> {
    const input = await this.getInput();
    return input.setValue(address);
  }

  async getResult(): Promise<string> {
    const p = await this.getLookupResult();
    return p.text();
  }
}
```

</p>
</details>

## 4.3: Harness with multiple elements

Add a further button with type `button` in the request-info's template. It must be BEFORE the submit button. Verify that the **should find an adresss** fails.

Upgrade the `getButton` method in the harness so that it find the right one:

```typescript
  protected getButton = this.locatorFor(
    MatButtonHarness.with({ selector: '[data-testid=ri-search]' })
  );
```
