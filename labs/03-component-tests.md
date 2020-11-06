# Angular Workshop: Testing / Component Tests

- [Angular Workshop: Testing / Component Tests](#angular-workshop-testing--component-tests)
  - [Warm-Up with Unit Tests](#warm-up-with-unit-tests)
  - [Querying the DOM](#querying-the-dom)
  - [DOM & Mocking Services](#dom--mocking-services)
  - [DOM Interaction](#dom-interaction)
  - [Full Sanity test](#full-sanity-test)
  - [Lookup returning synchronous Observable](#lookup-returning-synchronous-observable)
  - [Lookup returning asynchronous Observable](#lookup-returning-asynchronous-observable)
  - [2 sequential searches](#2-sequential-searches)
  - [Snapshotting](#snapshotting)
  - [Hints](#hints)
    - [Dom Interaction](#dom-interaction-1)
    - [2 sequential searches](#2-sequential-searches-1)

In this lab, we will work against a component which is using the address lookuper to show the user if an address is valid or not.

1. Create a component **address** by running `npx ng g c address --skip-tests`. It should contain following code.

```typescript
@Component({
  selector: "app-address",
  templateUrl: "./address.component.html",
  styleUrls: ["./address.component.scss"],
})
export class AddressComponent implements OnInit {
  formGroup: FormGroup;
  title = "Address Validation";

  @Input() address: string;
  lookupResult$: Observable<string>;

  constructor(
    private lookuper: AddressLookuper,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      address: [],
    });
    if (this.address) {
      this.formGroup.setValue({ addresss: this.address });
    }
  }

  search() {
    this.lookupResult$ = this.lookuper
      .lookup(this.formGroup.value.address)
      .pipe(map((found) => (found ? "Address found" : "Address not found")));
  }
}
```

2. Add following template

```html
<p>{{ title }}</p>
<form (ngSubmit)="search()" [formGroup]="formGroup">
  <input formControlName="address" placeholder="address" data-test="address" />
  <button type="button">Submit</button>
</form>
<p *ngIf="lookupResult$ | async as lookupResult" data-test="lookup-result">
  {{ lookupResult }}
</p>
```

## Warm-Up with Unit Tests

We can still run some basic unit tests against the component.

Write a test that verifies that the lookuper service is actually called and another one that makes sure that it is called with right parameters.

```typescript
it("should check if search calls service", () => {
  const lookup = jest.fn<Observable<boolean>, [string]>(() => of(true));
  const stub: Partial<AddressLookuper> = { lookup };
  const component = new AddressComponent(stub as AddressLookuper, null);
  component.formGroup = {
    value: { address: "" },
  } as FormGroup;
  component.search();

  expect(lookup).toBeCalled();
});
```

```typescript
// mocking test
it("should check if right parameters are passed to lookup service", () => {
  const lookup = jest.fn<Observable<boolean>, [string]>(() => of(true));
  const stub: Partial<AddressLookuper> = { lookup };
  const component = new AddressComponent(stub as AddressLookuper, null);
  component.formGroup = {
    value: { address: "Lindenstrasse 5, de" },
  } as FormGroup;

  component.search();
  const calledAddress = lookup.mock.calls[0][0];
  expect(calledAddress).toBe("Lindenstrasse 5, de");
});
```

## Querying the DOM

Write two tests that do DOM Querying by using the TestBed.

One test should check if the title can changed and the other one should set a default value for the form field.

```typescript
it("should check the title", () => {
  const fixture = TestBed.configureTestingModule({
    declarations: [AddressComponent],
    imports: [ReactiveFormsModule],
    providers: [{ provide: AddressLookuper, useValue: null }],
  }).createComponent(AddressComponent);
  fixture.detectChanges();

  const p = fixture.debugElement.query(By.css("p"))
    .nativeElement as HTMLElement;
  expect(p.textContent).toBe("Address Validation");

  fixture.componentInstance.title = "Test Title";
  fixture.detectChanges();
  expect(p.textContent).toBe("Test Title");
});
```

```typescript
it("should check input fields have right values", () => {
  TestBed.configureTestingModule({
    declarations: [AddressComponent],
    imports: [ReactiveFormsModule],
    providers: [{ provide: AddressLookuper, useValue: null }],
  });
  const fixture = TestBed.createComponent(AddressComponent);
  const component = fixture.componentInstance;
  fixture.detectChanges();

  component.formGroup.patchValue({
    address: "Hauptstraße 5",
  });
  const address = fixture.debugElement.query(By.css("input[data-test=address]"))
    .nativeElement as HTMLInputElement;

  expect(address.value).toBe("Hauptstraße 5");
});
```

## DOM & Mocking Services

Mock the Lookup service so that it returns no results. Verify that it shows the right message

```typescript
it("should fail on no input", () => {
  const fixture = TestBed.configureTestingModule({
    declarations: [AddressComponent],
    imports: [ReactiveFormsModule],
    providers: [
      { provide: AddressLookuper, useValue: { lookup: () => of(false) } },
    ],
  }).createComponent(AddressComponent);

  fixture.detectChanges();
  fixture.componentInstance.search();
  fixture.detectChanges();
  const lookupResult = fixture.debugElement.query(
    By.css("[data-test=lookup-result]")
  ).nativeElement as HTMLElement;
  expect(lookupResult.textContent.trim()).toBe("Address not found");
});
```

## DOM Interaction

Interact with DOM by clicking on the submit button. This test should reveal a bug in the template. Fix it!

```typescript
it("should trigger search on click", () => {
  const stub: Partial<AddressLookuper> = { lookup: jest.fn(() => of(true)) };
  const fixture = TestBed.configureTestingModule({
    declarations: [AddressComponent],
    imports: [ReactiveFormsModule],
    providers: [{ provide: AddressLookuper, useValue: stub }],
  }).createComponent(AddressComponent);

  fixture.detectChanges();
  const button = fixture.debugElement.query(By.css("button"))
    .nativeElement as HTMLButtonElement;
  button.click();
  expect(stub.lookup).toHaveBeenCalled();
});
```

## Full Sanity test

Write a test that renders the component with no dependencies. This test should ensure that it runs. If you missed to add the right decorator in the service, it will fail.

```typescript
it("should show nothing with a real HttpClient", () => {
  const fixture = TestBed.configureTestingModule({
    declarations: [AddressComponent],
    imports: [ReactiveFormsModule, HttpClientModule],
  }).createComponent(AddressComponent);

  fixture.componentInstance.formGroup = {
    value: {
      address: "Lincoln Corner 1",
    },
  } as FormGroup;
  fixture.componentInstance.search();
  fixture.detectChanges();
  const lookupResult = fixture.debugElement.query(
    By.css("[data-test=lookup-result]")
  );
  expect(lookupResult).toBeNull();
});
```

## Lookup returning synchronous Observable

Write a test where the lookup method returns an observable which runs synchronously (of[true])

```typescript
it("should not fail for Hauptstrasse with sync observable", () => {
  const lookup = (address) => {
    if (address === "Hauptstrasse 5") {
      return of(true);
    }
  };

  const fixture = TestBed.configureTestingModule({
    declarations: [AddressComponent],
    imports: [ReactiveFormsModule],
    providers: [{ provide: AddressLookuper, useValue: { lookup } }],
  }).createComponent(AddressComponent);

  fixture.detectChanges();
  const input = fixture.debugElement.query(By.css("[data-test=address]"))
    .nativeElement as HTMLInputElement;
  input.value = "Hauptstrasse 5";
  input.dispatchEvent(new Event("input"));
  fixture.detectChanges();

  const button = fixture.debugElement.query(By.css("button"))
    .nativeElement as HTMLButtonElement;
  button.click();
  fixture.detectChanges();
  const lookupResult = fixture.debugElement.query(
    By.css("[data-test=lookup-result]")
  ).nativeElement as HTMLElement;

  expect(lookupResult.textContent.trim()).toBe("Address found");
});
```

## Lookup returning asynchronous Observable

Write a test where the lookup method returns an observable which runs asynchronously: of(true).pipe(delay(0))

You will have to use the **fakeAsync** and **tick** methods.

```typescript
it("should not fail with async observable", fakeAsync(() => {
  const lookup = (address) => {
    if (address === "Hauptstrasse") {
      return of(true).pipe(delay(0));
    }
  };

  const fixture = TestBed.configureTestingModule({
    declarations: [AddressComponent],
    imports: [ReactiveFormsModule],
    providers: [{ provide: AddressLookuper, useValue: { lookup } }],
  }).createComponent(AddressComponent);

  fixture.detectChanges();
  const input = fixture.debugElement.query(By.css("[data-test=address]"))
    .nativeElement as HTMLInputElement;
  input.value = "Hauptstrasse";
  input.dispatchEvent(new Event("input"));
  fixture.detectChanges();

  const button = fixture.debugElement.query(By.css("button"))
    .nativeElement as HTMLButtonElement;
  button.click();
  fixture.detectChanges();
  tick();
  fixture.detectChanges();
  const lookupResult = fixture.debugElement.query(
    By.css("[data-test=lookup-result]")
  ).nativeElement as HTMLElement;

  expect(lookupResult.textContent.trim()).toBe("Address found");
}));
```

## 2 sequential searches

Write a test where you do two search queries sequentially. The first one should end with an invalid address, the second with a valid one.

You should discover a bug in the component. Depending on the implementation of your fix, it can be that the first two tests without the TestBed will fail. Adopt them as well.

```typescript
it("should check both not-validation and validated", fakeAsync(() => {
  const lookup = (address) => of(address === "Winkelgasse").pipe(delay(0));

  const fixture = TestBed.configureTestingModule({
    declarations: [AddressComponent],
    imports: [ReactiveFormsModule],
    providers: [{ provide: AddressLookuper, useValue: { lookup } }],
  }).createComponent(AddressComponent);

  fixture.detectChanges();
  const input = fixture.debugElement.query(By.css("[data-test=address]"))
    .nativeElement as HTMLInputElement;
  input.value = "Diagon Alley";
  input.dispatchEvent(new Event("input"));
  fixture.detectChanges();

  const button = fixture.debugElement.query(By.css("button"))
    .nativeElement as HTMLButtonElement;
  button.click();
  fixture.detectChanges();
  tick();
  fixture.detectChanges();
  const lookupResult = fixture.debugElement.query(
    By.css("[data-test=lookup-result]")
  ).nativeElement as HTMLElement;

  expect(lookupResult.textContent.trim()).toBe("Address not found");

  input.value = "Winkelgasse";
  input.dispatchEvent(new Event("input"));
  fixture.detectChanges();
  button.click();
  fixture.detectChanges();
  tick();
  fixture.detectChanges();
  expect(lookupResult.textContent.trim()).toBe("Address found");
}));
```

## Snapshotting

Write a test with Jest's snapshotting feature. Play a little bit with the interactive update feature by changing some small things in the template.

```typescript
it("should check the snapshot", () => {
  TestBed.configureTestingModule({
    declarations: [AddressComponent],
    imports: [ReactiveFormsModule],
    providers: [{ provide: AddressLookuper, useValue: null }],
  });
  const fixture = TestBed.createComponent(AddressComponent);
  expect(fixture).toMatchSnapshot();
});
```

## Hints

### Dom Interaction

In the template, the button has type of `button`. Set it to `submit`.

### 2 sequential searches

You will have to update add a `submitter$` subject which fires on each submit. That subject should be piped so that each next, it should call the lookup method. The result of the piped subject should become the new `lookupResult$`.

```typescript
class AddressComponent {
  submitter$ = new Subject<void>();

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      address: [],
    });
    if (this.address) {
      this.formGroup.setValue({ addresss: this.address });
    }

    this.lookupResult$ = this.submitter$.pipe(
      switchMap(() => this.lookuper.lookup(this.formGroup.value.address)),
      map((found) => (found ? "Address found" : "Address not found"))
    );
  }

  search() {
    this.submitter$.next();
  }
}
```
