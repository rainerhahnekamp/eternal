- [1. Nested Components - Stubs](#1-nested-components---stubs)
- [2. Nested Components - Mocked](#2-nested-components---mocked)
- [3. TestBed Factory method](#3-testbed-factory-method)
- [4. Test Harnesses](#4-test-harnesses)
- [5. Reusing Material Harnesses](#5-reusing-material-harnesses)
- [6: Harness with multiple elements](#6-harness-with-multiple-elements)
- [7. Bonus: Pipe Testing with Spectator](#7-bonus-pipe-testing-with-spectator)
- [8. Bonus: Directive Testing with Spectator](#8-bonus-directive-testing-with-spectator)
- [9. Bonus: Verify multiple input change](#9-bonus-verify-multiple-input-change)

# 1. Nested Components - Stubs

Let's pop up the request information screen. We will enhance the input and submit button visually with Angular Material.

1. Replace the form fields (everything inside the form tag) in `request-info.component.html` with the following.

```html
<p>
  <mat-form-field>
    <mat-label>Address</mat-label>
    <input data-test="address" formControlName="address" matInput />
    <mat-icon matSuffix>location_on</mat-icon>
    <mat-hint>Please enter your address</mat-hint>
  </mat-form-field>
</p>
<button color="primary" data-test="btn-search" mat-raised-button type="submit">Send</button>
```

1. Also make sure that `MatButtonModule`, `MatFormFieldModule`, `MatInputModule`, and `MatIconModule` are imported in the `RequestInfoComponentModule`.

2. Open **holidays/request-info/request-info.component.temp.spec.ts** and add `skip` to the `describe` command. It should read:

```typescript
describe.skip('RequestInfo Component Temporary', () => {
  // ...
});
```

4. Add a unit test with the prefix `only`.

**holidays/request-info/request-info.component.spec.ts**

```typescript
const noMaterialCheck = {
  provide: MATERIAL_SANITY_CHECKS,
  useValue: false
};

it.only('should mock components', () => {
  // tslint:disable-next-line:component-selector
  @Component({ selector: 'mat-form-field', template: '' })
  class MatFormField {}

  // tslint:disable-next-line:component-selector
  @Component({ selector: 'mat-hint', template: '' })
  class MatHint {}

  // tslint:disable-next-line:component-selector
  @Component({ selector: 'mat-icon', template: '' })
  class MatIcon {}

  // tslint:disable-next-line:component-selector
  @Component({ selector: 'mat-label', template: '' })
  class MatLabel {}

  const fixture = TestBed.configureTestingModule({
    declarations: [RequestInfoComponent, MatFormField, MatHint, MatIcon, MatLabel],
    imports: [ReactiveFormsModule],
    providers: [{ provide: AddressLookuper, useValue: null }, noMaterialCheck]
  }).createComponent(RequestInfoComponent);

  fixture.detectChanges();
});
```

To verify that the test turns red, don't add one of the components to the `declarations` property.

# 2. Nested Components - Mocked

As in the first exercise, but this team use the method `MockComponent(ComponentClass)` from `ng-mocks` in the `declarations` property of the `TestingModule`.

<details>
<summary>Show Solution</summary>
<p>

```typescript
it.only('should mock components with ng-mocks', () => {
  const fixture = TestBed.configureTestingModule({
    declarations: [
      RequestInfoComponent,
      MockComponent(MatFormField),
      MockComponent(MatHint),
      MockComponent(MatIcon),
      MockComponent(MatLabel)
    ],
    imports: [ReactiveFormsModule],
    providers: [{ provide: AddressLookuper, useValue: null }, noMaterialCheck]
  }).createComponent(RequestInfoComponent);

  fixture.detectChanges();
  expect(true).toBe(true);
});
```

</p>
</details>

# 3. TestBed Factory method

We would have to refactor the configuration of the TestModule for all our other unit tests. To avoid high cohesion, we did not use a common setup function, i.e. `beforeEach`. Instead, we will provide a customisable factory method for the test's module configuration.

Remove the `only` commands so that all tests in **request-info.component.spec.ts** are run.

Apply the newly created factory method the **should find an address** test.

1. Create a new method inside **request-info.component.spec.ts**.

```typescript
const setup = (config: TestModuleMetadata = {}) => {
  const lookupMock = jest.fn<Observable<boolean>, [string]>();
  const defaultConfig: TestModuleMetadata = {
    imports: [NoopAnimationsModule, RequestInfoComponentModule],
    providers: [
      {
        provide: AddressLookuper,
        useValue: { lookup: lookupMock }
      },
      noMaterialCheck
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

  const input = fixture.debugElement.query(By.css('[data-test=address]'))
    .nativeElement as HTMLInputElement;
  const button = fixture.debugElement.query(By.css('[data-test=btn-search]'))
    .nativeElement as HTMLButtonElement;

  fixture.detectChanges();
  input.value = 'Domgasse 15';
  input.dispatchEvent(new Event('input'));
  button.click();
  tick();
  fixture.detectChanges();
  const lookupResult = fixture.debugElement.query(By.css('[data-test=lookup-result]'))
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

# 4. Test Harnesses

Create a harness for the address component.

**request-info.component.harness.ts**

```typescript
import { ComponentHarness } from '@angular/cdk/testing';

export class RequestInfoComponentHarness extends ComponentHarness {
  static hostSelector = 'app-request-info';
  protected getTitle = this.locatorFor('h2');
  protected getInput = this.locatorFor('[data-test=address]');
  protected getButton = this.locatorFor('[data-test=btn-search]');
  protected getLookupResult = this.locatorFor('[data-test=lookup-result]');

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

Use the harness in the existing test "should find an address". **Mind the switch from `fakeAsync` to an `async` method**.

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

# 5. Reusing Material Harnesses

Our harness can access its child components also via harnesses, if they provide them. As a matter of fact, we are using Angular Material which provides full support.

Inside your harness, change the selector for the input and button component. You just need to pass the Type inside the `locatorFor` method. That will `MatInputHarness` and `MatButtonHarness`.

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
  protected getTitle = this.locatorFor('h2');
  protected getInput = this.locatorFor(MatInputHarness);
  protected getButton = this.locatorFor(MatButtonHarness);
  protected getLookupResult = this.locatorFor('[data-test=lookup-result]');

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

# 6: Harness with multiple elements

Add a further button with type `button` in the request-info's template. It must be BEFORE the submit button. Verify that the **should find an adresss** fails.

Upgrade the `getButton` method in the harness so that it find the right one:

```typescript
  protected getButton = this.locatorFor(
    MatButtonHarness.with({ selector: '[data-test=btn-search]' })
  );
```

# 7. Bonus: Pipe Testing with Spectator

Take a look at the implementation of **customers/customer.pipe.ts**.

We will use spectator to test it and use a custom host for that:

**customers/customer.pipe.spec.ts**

```typescript
import { Component, Input } from '@angular/core';
import { createPipeFactory } from '@ngneat/spectator/jest';
import { Customer } from './customer';
import { CustomerPipe } from './customer.pipe';

describe('Customer Pipe', () => {
  const customer: Customer = {
    id: 1,
    firstname: 'Karl',
    name: 'Feiersberger',
    birthdate: '1991-01-20',
    country: 'AT'
  };

  @Component({
    template: '<p>{{ customer | customer}}</p>'
  })
  class CustomerPipeTestComponent {
    @Input() customer: Customer = customer;
  }

  const createPipe = createPipeFactory({
    pipe: CustomerPipe,
    host: CustomerPipeTestComponent
  });

  it("should print the user's name", () => {
    const spectator = createPipe();
    expect(spectator.element).toHaveText('Feiersberger, Karl');
  });
});
```

Make sure that this code runs. Study it and come up with three additional test:

- Test for customer where firstname and name are an empty string
- Test where only the firstname is empty
- Test where only the name is empty

<details>
<summary>Show Solution</summary>
<p>

```typescript
it('should use - for no names', () => {
  const spectator = createPipe({
    hostProps: { customer: { ...customer, name: '', firstname: '' } }
  });
  expect(spectator.element).toHaveText('-');
});

it('should print the name without spaces and comma on no firstname', () => {
  const spectator = createPipe({
    hostProps: { customer: { ...customer, name: 'Huber', firstname: '' } }
  });
  expect(spectator.element).toHaveText('Huber');
});

it('should print the firstname without spaces and common on no name', () => {
  const spectator = createPipe({
    hostProps: { customer: { ...customer, name: '', firstname: 'Anja' } }
  });
  expect(spectator.element).toHaveText('Anja');
});
```

</p>
</details>

# 8. Bonus: Directive Testing with Spectator

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

# 9. Bonus: Verify multiple input change

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
