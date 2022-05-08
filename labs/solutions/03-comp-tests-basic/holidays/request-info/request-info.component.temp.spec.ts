import {HttpClient} from "@angular/common/http";
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from "@angular/core/testing";
import {ReactiveFormsModule} from "@angular/forms";
import {By} from "@angular/platform-browser";
import {asyncScheduler, Observable, of, scheduled} from "rxjs";
import {AddressLookuper} from "../../shared/address-lookuper.service";
import {assertType} from "../../shared/assert-type";
import {RequestInfoComponent} from "./request-info.component";
import {RequestInfoComponentModule} from "./request-info.component.module";

for lab 04

describe("RequestInfo Component Temporary", () => {
  let lookupMock = jest.fn<Observable<boolean>, [string]>();
  let fixture: ComponentFixture<RequestInfoComponent>;
  let component: RequestInfoComponent;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      imports: [RequestInfoComponentModule],
      providers: [{provide: AddressLookuper, useValue: {lookup: lookupMock}}]
    }).createComponent(RequestInfoComponent);
    lookupMock.mockReset();
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should check the title", () => {
    const title = fixture.debugElement.query(By.css("h2")).nativeElement as HTMLElement;
    expect(title.textContent).toBe("Request More Information");

    fixture.componentInstance.title = "Test Title";
    fixture.detectChanges();

    expect(title.textContent).toBe("Test Title");
  });

  it("should check input fields have right values", () => {
    component.formGroup.patchValue({
      address: "Hauptstraße 5"
    });
    const address = fixture.debugElement.query(By.css("[data-testid=address]"))
      .nativeElement as HTMLInputElement;

    expect(address.value).toBe("Hauptstraße 5");
  });

  it("should fail on no input", fakeAsync(() => {
    expect.hasAssertions();
    lookupMock.mockReturnValue(scheduled([false], asyncScheduler));

    fixture.componentInstance.search();
    tick();
    fixture.detectChanges();
    const lookupResult = fixture.debugElement.query(By.css("[data-testid=lookup-result]"))
      .nativeElement as HTMLElement;
    expect(lookupResult.textContent).toContain("Address not found");
  }));

  it("should trigger lookup on click", () => {
    lookupMock.mockReturnValue(scheduled([false], asyncScheduler));
    const button = fixture.debugElement.query(By.css("[data-testid=btn-search]"))
      .nativeElement as HTMLButtonElement;
    button.click();

    expect(lookupMock).toHaveBeenCalled();
  });

  it("should check the snapshot", () => {
    expect(fixture).toMatchSnapshot();
  });
});

describe.skip("Request-Info Individual", () => {
  it("should verify that the address input sets the field value", fakeAsync(() => {
    const fixture = TestBed.configureTestingModule({
      imports: [RequestInfoComponentModule],
      providers: [{provide: AddressLookuper, useValue: null}]
    }).createComponent(RequestInfoComponent);
    fixture.componentInstance.address = "Domgasse 5";

    fixture.detectChanges();
    const field = fixture.debugElement.query(By.css("[data-testid=address]"))
      .nativeElement as HTMLInputElement;

    expect(field.value).toBe("Domgasse 5");
  }));

  it("should do an integration test by mocking the HttpClient", fakeAsync(() => {
    const httpClient = assertType<HttpClient>({get: () => of([true])});
    const fixture = TestBed.configureTestingModule({
      declarations: [RequestInfoComponent],
      imports: [ReactiveFormsModule],
      providers: [{provide: HttpClient, useValue: httpClient}]
    }).createComponent(RequestInfoComponent);

    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css("[data-testid=address]"))
      .nativeElement as HTMLInputElement;
    input.value = "Domgasse 15";
    input.dispatchEvent(new Event("input"));
    fixture.componentInstance.search();
    tick();
    fixture.detectChanges();
    const lookupResult = fixture.debugElement.query(By.css("[data-testid=lookup-result]"))
      .nativeElement as HTMLElement;

    expect(lookupResult.textContent).toContain("Brochure sent");
  }));

  it("should spy AddressLookuper::lookup", fakeAsync(() => {
    const httpClient = assertType<HttpClient>({get: () => of([true])});
    const fixture = TestBed.configureTestingModule({
      declarations: [RequestInfoComponent],
      imports: [ReactiveFormsModule],
      providers: [{provide: HttpClient, useValue: httpClient}]
    }).createComponent(RequestInfoComponent);
    const addressLookuper = TestBed.inject(AddressLookuper);
    const spy = jest.spyOn(addressLookuper, "lookup");
    spy.mockReturnValue(of(true));
    const input = fixture.debugElement.query(By.css("[data-testid=address]"))
      .nativeElement as HTMLInputElement;
    const button = fixture.debugElement.query(By.css("[data-testid=btn-search]"))
      .nativeElement as HTMLButtonElement;

    fixture.detectChanges();
    input.value = "Domgasse 15";
    input.dispatchEvent(new Event("input"));
    button.click();

    expect(spy).toHaveBeenCalledWith("Domgasse 15");
  }));
});
