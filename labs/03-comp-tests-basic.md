- [1. Querying the DOM](#1-querying-the-dom)
- [2. DOM & Mocking Services](#2-dom--mocking-services)
- [3. DOM Interaction](#3-dom-interaction)
- [4. Snapshotting](#4-snapshotting)
- [5. Find an Address](#5-find-an-address)
- [6. Bonus: Unit Test](#6-bonus-unit-test)
- [7: Bonus: Setting @Input](#7-bonus-setting-input)
- [8: Bonus: Integration Test](#8-bonus-integration-test)
- [9: Bonus: Spy on AddressLookuper::lookup](#9-bonus-spy-on-addresslookuperlookup)

In this lab, we will integrate the address lookuper into the request-info component.

Exercises 1-4 are only temporary. That's we put them into into a separate spec file.

**holidays/request-info/request-info.component.ts**:

Inject the addressLookuper service into the component:

```typescript
export class RequestInfoComponent implements OnInit {
  // ...
  lookuper = { lookup: (address) => of(false) }; // <- remove that one
  // ...

  constructor(private lookuper: AddressLookuper, private formBuilder: FormBuilder) {}

  // ...
}
```

Also create a spec file for that component.

# 1. Querying the DOM

Write two tests that query the DOM.

One test should check if the title can be changed and the other one should set a default value for the form field.

This one misses change detection. Find the right place and add it.

**holidays/request-info/request-info.component.temp.spec.ts**

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { AddressLookuper } from '../../shared/address-lookuper.service';
import { RequestInfoComponent } from './request-info.component';
import { RequestInfoComponentModule } from './request-info.component.module';

describe('RequestInfo Component Temporary', () => {
  let lookupMock = jest.fn<Observable<boolean>, [string]>();
  let fixture: ComponentFixture<RequestInfoComponent>;
  let component: RequestInfoComponent;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      imports: [RequestInfoComponentModule],
      providers: [{ provide: AddressLookuper, useValue: { lookup: lookupMock } }]
    }).createComponent(RequestInfoComponent);
    lookupMock.mockReset();
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should check the title', () => {
    const title = fixture.debugElement.query(By.css('h2')).nativeElement as HTMLElement;
    expect(title.textContent).toBe('Request More Information');

    fixture.componentInstance.title = 'Test Title';

    expect(title.textContent).toBe('Test Title');
  });
```

<details>
<summary>Show Solution</summary>
<p>

`fixture.detectChanges()` has to be called after the title property has been set.

</p>
</details>

You will have to find out the right css selector for the input field and also add the change detection.

```typescript
it('should check input fields have right values', () => {
  component.formGroup.patchValue({
    address: 'Hauptstraße 5'
  });
  const address = fixture.debugElement.query(By.css('add-your-selector-here'))
    .nativeElement as HTMLInputElement;

  expect(address.value).toBe('Hauptstraße 5');
});
```

<details>
<summary>Show Solution</summary>
<p>

The css selector is `[data-testid=address]`

</p>
</details>

# 2. DOM & Mocking Services

Mock the Lookup service so that it returns no results. Verify that it shows the right message.

**holidays/request-info/request-info.component.temp.spec.ts**

```typescript
it('should fail on no input', fakeAsync(() => {
  expect.hasAssertions();
  lookupMock.mockReturnValue(scheduled([false], asyncScheduler));

  fixture.componentInstance.search();
  tick();
  fixture.detectChanges();
  const lookupResult = fixture.debugElement.query(By.css('[data-testid=lookup-result]'))
    .nativeElement as HTMLElement;
}));
```

<details>
<summary>Show Solution</summary>
<p>

Add following snippet at the end:

```typescript
expect(lookupResult.textContent).toContain('Address not found');
```

</p>
</details>

# 3. DOM Interaction

**holidays/request-info/request-info.component.temp.spec.ts**

Test that the lookup method is called clicking on the submit button.

```typescript
it('should trigger lookup on click', fakeAsync(() => {
  // add your code for clicking on the submit here

  expect(lookupMock).toHaveBeenCalled();
}));
```

<details>
<summary>Show Solution</summary>
<p>

```typescript
lookupMock.mockReturnValue(scheduled([false], asyncScheduler));
const button = fixture.debugElement.query(By.css('[data-testid=btn-search]'))
  .nativeElement as HTMLButtonElement;
button.click();
```

</p>
</details>

# 4. Snapshotting

**holidays/request-info/request-info.component.temp.spec.ts**

Write a test with Jest's snapshotting feature.

```typescript
it('should check the snapshot', () => {
  expect(fixture).toMatchSnapshot();
});
```

# 5. Find an Address

With all the existing knowledge so far, come up with one on your own.

The mocked lookuper should true when the query is for "Domgasse 5" and false if it is "Domgasse 15".

For positive address lookups, the message should say "Brochure sent". Call that test **should find an address**.

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
      imports: [RequestInfoComponentModule],
      providers: [{ provide: AddressLookuper, useValue: lookuper }]
    }).createComponent(RequestInfoComponent);
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
});
```

</p>
</details>

# 6. Bonus: Unit Test

Create a unit test version for the **should find an address**. This means no `TestBed` and no interaction with the DOM.

<details>
<summary>Show Solution</summary>
<p>

```typescript
it(
  'should test as unit test',
  waitForAsync(() => {
    const formBuilder = {
      group: () => ({ value: { address: 'Domgasse 5' } })
    };
    const lookuper = {
      lookup: (query: string) => scheduled([query === 'Domgasse 5'], asyncScheduler)
    };
    const component = new RequestInfoComponent(
      assertType<FormBuilder>(formBuilder),
      assertType<AddressLookuper>(lookuper)
    );

    component.ngOnInit();
    component.lookupResult$?.subscribe((message) => {
      expect(message).toBe('Brochure sent');
    });

    component.search();
  })
);
```

</p>
</details>

# 7: Bonus: Setting @Input

Create a component test which sets the address property and verify that is shown in the input field.

This test should be part in **holidays/request-info/request-info.component.temp.spec.ts**

**Be aware**: There is a bug in the implementation.

<details>
<summary>Show Solution</summary>
<p>

The bug is a type in `request-info.component.ts`. Lookout for `addresss` instead of `address`.

```typescript
it('should verify that the address input sets the field value', fakeAsync(() => {
  const fixture = TestBed.configureTestingModule({
    imports: [RequestInfoComponentModule],
    providers: [{ provide: AddressLookuper, useValue: null }]
  }).createComponent(RequestInfoComponent);
  fixture.componentInstance.address = 'Domgasse 5';

  fixture.detectChanges();
  const field = fixture.debugElement.query(By.css('[data-testid=address]'))
    .nativeElement as HTMLInputElement;

  expect(field.value).toBe('Domgasse 5');
}));
```

</p>
</details>

# 8: Bonus: Integration Test

Write a test where you don't mock the `AddressLookuper` but only the `HttpClient`.

Add that test to **holidays/request-info/request-info.component.temp.spec.ts**

<details>
<summary>Show Solution</summary>
<p>

```typescript
it('should do an integration test by mocking the HttpClient', fakeAsync(() => {
  const httpClient = assertType<HttpClient>({ get: () => of([true]) });
  const fixture = TestBed.configureTestingModule({
    declarations: [RequestInfoComponent],
    imports: [ReactiveFormsModule],
    providers: [{ provide: HttpClient, useValue: httpClient }]
  }).createComponent(RequestInfoComponent);

  fixture.detectChanges();
  const input = fixture.debugElement.query(By.css('[data-testid=address]'))
    .nativeElement as HTMLInputElement;
  input.value = 'Domgasse 15';
  input.dispatchEvent(new Event('input'));
  fixture.componentInstance.search();
  tick();
  fixture.detectChanges();
  const lookupResult = fixture.debugElement.query(By.css('[data-testid=lookup-result]'))
    .nativeElement as HTMLElement;

  expect(lookupResult.textContent).toContain('Brochure sent');
}));
```

</p>
</details>

# 9: Bonus: Spy on AddressLookuper::lookup

Write a test that uses the `AddressLookuper` original, but mocks the `lookup` method via `jest.spyOn`. Verify with the spy that the `lookup` method is called.

<details>
<summary>Show Solution</summary>
<p>

```typescript
it('should spy AddressLookuper::lookup', fakeAsync(() => {
  const httpClient = assertType<HttpClient>({ get: () => of([true]) });
  const fixture = TestBed.configureTestingModule({
    declarations: [RequestInfoComponent],
    imports: [ReactiveFormsModule],
    providers: [{ provide: HttpClient, useValue: httpClient }]
  }).createComponent(RequestInfoComponent);
  const addressLookuper = TestBed.inject(AddressLookuper);
  const spy = jest.spyOn(addressLookuper, 'lookup');
  spy.mockReturnValue(of(true));
  const input = fixture.debugElement.query(By.css('[data-testid=address]'))
    .nativeElement as HTMLInputElement;
  const button = fixture.debugElement.query(By.css('[data-testid=btn-search]'))
    .nativeElement as HTMLButtonElement;

  fixture.detectChanges();
  input.value = 'Domgasse 15';
  input.dispatchEvent(new Event('input'));
  button.click();

  expect(spy).toHaveBeenCalledWith('Domgasse 15');
}));
```

</p>
</details>
