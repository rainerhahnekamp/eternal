- [1. Component Test for Request Info](#1-component-test-for-request-info)
- [2. Spectator](#2-spectator)
  - [2.1 Setup TestingModule](#21-setup-testingmodule)
  - [2.2 Mocked AddressLookuper](#22-mocked-addresslookuper)
  - [2.3 Integration test](#23-integration-test)
- [3. Harnesses](#3-harnesses)
  - [3.1 RequestInfoComponentHarness](#31-requestinfocomponentharness)
  - [3.2. Reusing Material Harnesses](#32-reusing-material-harnesses)
  - [3.3: Harness with multiple elements](#33-harness-with-multiple-elements)
- [4. Bonus: Holidays & Spectator](#4-bonus-holidays--spectator)
- [5. Bonus: Directive Testing with Spectator](#5-bonus-directive-testing-with-spectator)
- [6. Bonus: Verify multiple input change](#6-bonus-verify-multiple-input-change)

# 1. Component Test for Request Info

We will visually enhance the RequestInfo component with Angular Material.

1. Replace the form fields (everything inside the form tag) in `request-info.component.html` with the following.

```html
<p>
  <mat-form-field>
    <mat-label>Address</mat-label>
    <input data-testid="address" formControlName="address" matInput />
    <mat-icon matSuffix>location_on</mat-icon>
    <mat-hint>Please enter your address</mat-hint>
  </mat-form-field>
</p>
<button color="primary" data-testid="btn-search" mat-raised-button type="submit">Send</button>
```

2. Also make sure that `MatButtonModule`, `MatFormFieldModule`, `MatInputModule`, and `MatIconModule` are imported in the `RequestInfoComponentModule`.

3. Because of the additions, the tests in the temp file will not work anymore. Let's skip them. Open **holidays/request-info/request-info.component.temp.spec.ts** and add `skip` to the `describe` command. It should read:

```typescript
describe.skip('RequestInfo Component Temporary', () => {
  // ...
});
```

4. In the test **should find an address**, we want to use a factory method instead of `beforeEach`. Create a new method inside **request-info.component.spec.ts**.

```typescript
const setup = (config: TestModuleMetadata = {}) => {
  const lookupMock = jest.fn<Observable<boolean>, [string]>();
  const defaultConfig: TestModuleMetadata = {
    imports: [NoopAnimationsModule, RequestInfoComponentModule],
    providers: [
      {
        provide: AddressLookuper,
        useValue: { lookup: lookupMock }
      }
    ]
  };
  const fixture = TestBed.configureTestingModule({ ...defaultConfig, ...config }).createComponent(
    RequestInfoComponent
  );
  lookupMock.mockReset();

  return { fixture, lookupMock };
};
```

<details>
<summary>Show Solution</summary>
<p>

**request-info.component.spec.ts**

```typescript
it('should find an address', fakeAsync(() => {
  const { fixture, lookupMock } = setup();
  lookupMock.mockImplementation((query) => scheduled([query === 'Domgasse 5'], asyncScheduler));

  const input = fixture.debugElement.query(By.css('[data-testid=address]'))
    .nativeElement as HTMLInputElement;
  const button = fixture.debugElement.query(By.css('[data-testid=btn-search]'))
    .nativeElement as HTMLButtonElement;

  fixture.detectChanges();
  input.value = 'Domgasse 15';
  input.dispatchEvent(new Event('input'));
  button.click();
  tick();
  fixture.detectChanges();
  const lookupResult = fixture.debugElement.query(By.css('[data-testid=lookup-result]'))
    .nativeElement as HTMLElement;

  expect(lookupResult.textContent).toContain('Address not found');

  input.value = 'Domgasse 5';
  input.dispatchEvent(new Event('input'));
  button.click();
  tick();
  fixture.detectChanges();

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
    imports: [RequestInfoComponentModule],
    mocks: [AddressLookuper],
    declareComponent: false
  });

  const setup = () => {
    const spectator = createComponent();
    const lookuperMock = spectator.inject(AddressLookuper);
    return { spectator, lookuperMock };
  };

  const inputSelector = '[data-testid=address]';
  const buttonSelector = '[data-testid=btn-search]';
  const lookupSelector = '[data-testid=lookup-result]';

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
  const inputSelector = '[data-testid=address]';
  const buttonSelector = '[data-testid=btn-search]';
  const lookupSelector = '[data-testid=lookup-result]';

  describe('Component Test', () => {
    // ...
  });

  describe('Integration Test', () => {
    const createComponent = createComponentFactory({
      component: RequestInfoComponent,
      imports: [RequestInfoComponentModule, HttpClientTestingModule],
      declareComponent: false
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
          .expectOne((req) => {
            return req.url.match(/nominatim/);
          })
          .flush(response);

        spectator.detectChanges();
        expect(spectator.query(lookupSelector)).toHaveText(message);
      })()
    );
  });
});
```

# 3. Harnesses

## 3.1 RequestInfoComponentHarness

Create a harness for the request info component.

**request-info.component.harness.spec.ts**

```typescript
import { ComponentHarness } from '@angular/cdk/testing';

export class RequestInfoComponentHarness extends ComponentHarness {
  static hostSelector = 'app-request-info';
  protected getInput = this.locatorFor('[data-testid=address]');
  protected getButton = this.locatorFor('[data-testid=btn-search]');
  protected getLookupResult = this.locatorFor('[data-testid=lookup-result]');

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

Use the harness in the existing test "should find an address" in **request-info.component.spec.ts**.

**Mind the switch from `fakeAsync` to an `async` method**.

```typescript
it('should find an address', async () => {
  const { fixture, lookupMock } = setup();
  lookupMock.mockImplementation((query) => scheduled([query === 'Domgasse 5'], asyncScheduler));

  const harness = await TestbedHarnessEnvironment.harnessForFixture(
    fixture,
    RequestInfoComponentHarness
  );

  // use harness here to set the queries and submit

  return expect(harness.getResult()).resolves.toBe('Brochure sent');
});
```

<details>
<summary>Show Solution</summary>
<p>

With test harness, the search is very simple. You need to insert following code.

```typescript
await harness.writeAddress('Domgasse 15');
await harness.search();
const message = await harness.getResult();
expect(message).toBe('Address not found');
await harness.writeAddress('Domgasse 5');
await harness.search();
```

</p>
</details>

## 3.2. Reusing Material Harnesses

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
  static hostSelector = 'app-request-info';
  protected getInput = this.locatorFor(MatInputHarness);
  protected getButton = this.locatorFor(MatButtonHarness);
  protected getLookupResult = this.locatorFor('[data-testid=lookup-result]');

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

## 3.3: Harness with multiple elements

Add a further button with type `button` in the request-info's template. It must be BEFORE the submit button. Verify that the **should find an adresss** fails.

Upgrade the `getButton` method in the harness so that it find the right one:

```typescript
  protected getButton = this.locatorFor(
    MatButtonHarness.with({ selector: '[data-testid=btn-search]' })
  );
```

# 4. Bonus: Holidays & Spectator

Write a test for the **/holidays/holidays.component.ts** with Spectator. Mock only the `Store`. The sub component `HolidayCardComponent` should not be mocked.

In this test, you cannot use the `mock` property of `createComponentFactory`. Use `createSpyFromClass` (jest-auto-spies) or `createSpyObject` (spectator) instead.

The reason why you cannot simply mock the Store is that it is already inside of the constructor.

<details>
<summary>Show Solution</summary>
<p>

```typescript
import { createRoutingFactory, createSpyObject } from '@ngneat/spectator/jest';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { fromHolidays } from '../+state/holidays.selectors';
import { createHoliday } from '../holiday';
import { HolidaysComponent } from './holidays.component';
import { HolidaysComponentModule } from './holidays.component.module';

describe('Holidays Component', () => {
  const storeMock = createSpyObject(Store);
  const createComponent = createRoutingFactory({
    component: HolidaysComponent,
    imports: [HolidaysComponentModule],
    providers: [{ provide: Store, useValue: storeMock }],
    declareComponent: false
  });

  it('should show a holiday', () => {
    const holiday = createHoliday({ title: 'Vienna' });
    storeMock.select.mockImplementation((selector) => {
      expect(selector).toBe(fromHolidays.get);
      return of([holiday]);
    });

    const spectator = createComponent();

    expect(spectator.query('[data-testid=holiday-1] mat-card-title')).toHaveExactText('Vienna');
  });
});
```

</p>
</details>

# 5. Bonus: Directive Testing with Spectator

If you haven't done so, run the application and click on holidays. Hover with the mouse over an image. You should see that the is replaced by another for about 1.5 seconds. This is done by a directive, we are going to test with Spectator.

Open the and study the implementation of the directive in **shared/dont-leave-me.directive.ts**.

The unit test with spectator is really short:

**shared/dont-leave-me.directice.spec.ts**

```typescript
import { createDirectiveFactory } from '@ngneat/spectator/jest';
import { DontLeaveMeDirective } from './dont-leave-me.directive';

describe("Don't leave me", () => {
  const createDirective = createDirectiveFactory(DontLeaveMeDirective);

  it('should show the dog image', () => {
    const spectator = createDirective('<img appDontLeaveMe src="/dummy.jpg">');
    spectator.dispatchMouseEvent(spectator.element, 'mouseleave');

    expect(spectator.element).toHaveAttribute('src', '/assets/dontleaveme.jpg');
  });
});
```

With all the knowledge you learned so far, write a second test that verifies that the original image is put back after 1.5 seconds.

**Hint**: `fakeAsync`

<details>
<summary>Show Solution</summary>
<p>

```typescript
it('should revert to original after 1.5 seconds', fakeAsync(() => {
  const spectator = createDirective('<img appDontLeaveMe src="/dummy.jpg">');
  spectator.dispatchMouseEvent(spectator.element, 'mouseleave');
  tick(1500);
  expect(spectator.element).toHaveAttribute('src', 'http://localhost/dummy.jpg');
}));
```

</p>
</details>

# 6. Bonus: Verify multiple input change

We want to verify, if the input field is updated, if the input value for address changes multiple times. `ngOnChanges` is not executed automatically but we use a wrapper component instead.

**holidays/request-info/request-info.component.spec.ts**

```typescript
it('should verify ngOnChanges with address', async () => {
  @Component({
    template: ` <app-request-info [address]="address"></app-request-info>`
  })
  class WrapperComponent {
    address = 'Domgasse 15';
  }

  setup({ declarations: [WrapperComponent] });
  const fixture = TestBed.createComponent(WrapperComponent);

  const loader = await TestbedHarnessEnvironment.loader(fixture);
  const harness = await loader.getHarness(RequestInfoComponentHarness);

  expect(await harness.getAddress()).toBe('Domgasse 15');
  fixture.componentInstance.address = 'Domgasse 5';
  expect(await harness.getAddress()).toBe('Domgasse 5');
});
```

This test should fail. Make the required updates in the component and the harness `getAddress()`.

<details>
<summary>Show Solution</summary>
<p>

You have to move the part where it sets the form value from `ngOnInit` to `ngOnChanges`.

**holidays/request-info/request-info.component.ts**

```typescript
//
  ngOnChanges(changes: SimpleChanges) {
    if (this.address) {
      this.formGroup.setValue({ address: this.address });
    }
  }
  //
```

</p>
</details>
