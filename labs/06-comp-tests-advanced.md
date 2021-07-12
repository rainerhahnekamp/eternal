- [1. Nested Components - Stubs](#1-nested-components---stubs)
- [2. Nested Components - Mocked](#2-nested-components---mocked)
- [3. TestBed Factory method](#3-testbed-factory-method)
- [4. Test Harnesses](#4-test-harnesses)
- [5. Reusing Material Harnesses](#5-reusing-material-harnesses)
- [6: Harness with multiple elements](#6-harness-with-multiple-elements)
- [7. Bonus: Pipe Testing with Spectator](#7-bonus-pipe-testing-with-spectator)
- [8. Bonus: Directive Testing with Spectator](#8-bonus-directive-testing-with-spectator)
- [9. Bonus: Verify multiple input change](#9-bonus-verify-multiple-input-change)
- [10. Bonus: Upgrade all other Component Tests to Harnesses](#10-bonus-upgrade-all-other-component-tests-to-harnesses)

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

2. Also make sure that `MatInputModule` and `MatIconModule` are imported into the holidays module.

3. Add a unit test with the prefix `only`.

**holidays/request-info/request-info.component.spec.ts**

```typescript
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
    providers: [{ provide: AddressLookuper, useValue: null }]
  }).createComponent(RequestInfoComponent);

  fixture.detectChanges();
});
```

To verify that the test turns red, just don't add one of the modules to `imports` property.

# 2. Nested Components - Mocked

As in the first exercise, but this team use the method `MockComponent(ComponentClass)` from `ng-mocks` in the `declarations` property of the `TestingModule`.

You have to modify the jest configuration prior to that.

**/apps/eternal/jest.config.js**

Add following property to the configuration:

`testRunner: 'jest-jasmine2'`

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
    providers: [{ provide: AddressLookuper, useValue: null }]
  }).createComponent(RequestInfoComponent);

  fixture.detectChanges();
  expect(true).toBe(true);
});
```

</p>
</details>

# 3. TestBed Factory method

We would have to refactor the configuration of the TestModule for all our other unit tests. To avoid high cohesion, we did not use a common setup function, i.e. `beforeEach`. Instead, we will provide a customisable factory method for the test's module configuration.

Mark the test _should find an address_ also with `only`. Apply the newly created factory method to it.

1. Create a new method inside **request-info.component.spec.ts**.

```typescript
const testModuleMetadata: TestModuleMetadata = {
  declarations: [RequestInfoComponent],
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    NoopAnimationsModule,
    ReactiveFormsModule
  ],
  providers: [{ provide: AddressLookuper, useValue: null }]
};

const createFixture = (config: TestModuleMetadata = {}) =>
  TestBed.configureTestingModule({ ...testModuleMetadata, ...config }).createComponent(
    RequestInfoComponent
  );
```

<details>
<summary>Show Solution</summary>
<p>

**request-info.component.spec.ts**

```typescript
it.only('should find an address', fakeAsync(() => {
  const lookuper = {
    lookup: (query: string) => scheduled([query === 'Domgasse 5'], asyncScheduler)
  };

  const fixture = createFixture({
    providers: [{ provide: AddressLookuper, useValue: lookuper }]
  });
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
import { AsyncFactoryFn, ComponentHarness, TestElement } from '@angular/cdk/testing';

export class RequestInfoComponentHarness extends ComponentHarness {
  static hostSelector = 'app-request-info';
  protected getTitle = this.locatorFor('h2');
  protected getInput = this.attrLocator('address');
  protected getButton = this.locatorFor('button[type=submit]');
  protected getLookupResult = this.attrLocator('lookup-result');

  async submit(): Promise<void> {
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

  protected attrLocator(tag: string): AsyncFactoryFn<TestElement> {
    return this.locatorFor(`[data-test=${tag}]`);
  }
}
```

Use the harness in the existing test "should find an address". **Mind the change to an async method**.

```typescript
it('should find an address', async () => {
  const lookuper = {
    lookup: jest.fn<Observable<boolean>, [string]>((query) =>
      scheduled([query === 'Domgasse 5'], asyncScheduler)
    )
  };
  const fixture = TestBed.configureTestingModule({
    ...testModuleMetadata,
    ...{ providers: [{ provide: AddressLookuper, useValue: lookuper }] }
  }).createComponent(RequestInfoComponent);

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
await harness.submit();
const message = await harness.getResult();
expect(message).toBe('Address not found');
await harness.writeAddress('Domgasse 5');
await harness.submit();
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
import { AsyncFactoryFn, ComponentHarness, TestElement } from '@angular/cdk/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatInputHarness } from '@angular/material/input/testing';

export class RequestInfoComponentHarness extends ComponentHarness {
  static hostSelector = 'app-request-info';
  protected getTitle = this.locatorFor('h2');
  protected getInput = this.locatorFor(MatInputHarness);
  protected getButton = this.locatorFor(MatButtonHarness);
  protected getLookupResult = this.attrLocator('lookup-result');

  async submit(): Promise<void> {
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

  protected attrLocator(tag: string): AsyncFactoryFn<TestElement> {
    return this.locatorFor(`[data-test=${tag}]`);
  }
}
```

</p>
</details>

# 6: Harness with multiple elements

Add a further button with type `button` in the request-info's template. It must be \*_before_+ the submit button. Verify that the **should find an adresss** fails.

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

We want to verify, if the input field is updated, if the input value for address changes multiple times. `ngOnChanges` is not executed automatically but we use a wrapper method instead.

```typescript
it('should verify the address input two times', async () => {
  @Component({
    template: "<app-request-info [address]='address'></app-request-info>"
  })
  class WrapperComponent {
    address: string = 'Domgasse 5';
  }

  await createFixtureAndHarness({
    ...testModuleMetadata,
    declarations: [WrapperComponent, RequestInfoComponent]
  });
  const wrapperFixture = TestBed.createComponent(WrapperComponent);
  const field = wrapperFixture.debugElement.query(By.css('[data-test=address]'))
    .nativeElement as HTMLInputElement;

  wrapperFixture.componentInstance.address = 'Domgasse 5';
  wrapperFixture.detectChanges();
  expect(field.value).toBe('Domgasse 5');

  wrapperFixture.componentInstance.address = 'Domgasse 15';
  wrapperFixture.detectChanges();
  expect(field.value).toBe('Domgasse 15');
});
```

This test should fail. Make the required updates in the component.

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

# 10. Bonus: Upgrade all other Component Tests to Harnesses

- You will have to find a way how to combine `async` with `fakeAsync`
- You will have extend the harness itself with further methods
- You might want to think about reducing the redundance of fetching the harness all the time.
