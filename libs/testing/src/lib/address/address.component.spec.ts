import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { AddressLookup } from '../address-lookup.service';
import { Address, AddressComponent } from './address.component';

describe.skip('Test Address input', () => {
  // mocking
  it('should check if search calls service', () => {
    const lookup = jest.fn<Observable<boolean>, [Address]>(() => of(true));
    const stub: Partial<AddressLookup> = { lookup };
    const component = new AddressComponent(stub as AddressLookup, null);
    component.formGroup = {
      value: { street: '', streetNumber: '' }
    } as FormGroup;
    component.search();

    expect(lookup).toBeCalled();
  });

  // mocking test
  it('should check if right parameters are passed to lookup service', () => {
    const lookup = jest.fn<Observable<boolean>, [Address]>(() => of(true));
    const stub: Partial<AddressLookup> = { lookup };
    const component = new AddressComponent(stub as AddressLookup, null);
    component.formGroup = {
      value: { street: 'Lindenstrasse', streetNumber: 5, country: 'de' }
    } as FormGroup;

    component.search();
    const calledAddress = lookup.mock.calls[0][0];
    expect(calledAddress.street).toBe('Lindenstrasse');
    expect(calledAddress.streetNumber).toBe(5);
    expect(calledAddress.country).toBe('de');
  });

  // DOM querying 2
  it('should check the title', () => {
    const fixture = TestBed.configureTestingModule({
      declarations: [AddressComponent],
      imports: [ReactiveFormsModule],
      providers: [{ provide: AddressLookup, useValue: null }]
    }).createComponent(AddressComponent);
    fixture.detectChanges();

    const p = fixture.debugElement.query(By.css('p'))
      .nativeElement as HTMLElement;
    expect(p.textContent).toBe('Address Validation');

    fixture.componentInstance.title = 'Test Title';
    fixture.detectChanges();
    expect(p.textContent).toBe('Test Title');
  });

  // DOM querying 1
  it('should check input fields have right values', () => {
    TestBed.configureTestingModule({
      declarations: [AddressComponent],
      imports: [ReactiveFormsModule],
      providers: [{ provide: AddressLookup, useValue: null }]
    });
    const fixture = TestBed.createComponent(AddressComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.formGroup.patchValue({
      street: 'Hauptstraße',
      streetNumber: '5'
    });
    const street = fixture.debugElement.query(By.css('input[name=street]'))
      .nativeElement as HTMLInputElement;
    const streetNumber = fixture.debugElement.query(
      By.css('input[name=streetNumber]')
    ).nativeElement as HTMLInputElement;

    expect(street.value).toBe('Hauptstraße');
    expect(streetNumber.value).toBe('5');
  });

  // combi DOM and component
  it('should fail on no input', () => {
    const fixture = TestBed.configureTestingModule({
      declarations: [AddressComponent],
      imports: [ReactiveFormsModule],
      providers: [{ provide: HttpClient, useValue: { get: () => of([true]) } }]
    }).createComponent(AddressComponent);

    fixture.detectChanges();
    fixture.componentInstance.search();
    fixture.detectChanges();
    const lookupResult = fixture.debugElement.query(
      By.css('[data-test=lookup-result]')
    ).nativeElement as HTMLElement;
    expect(lookupResult.textContent.trim()).toBe('Address not found');
  });

  // DOM interaction
  it('should trigger search on click', () => {
    const stub: Partial<AddressLookup> = { lookup: jest.fn(() => of(true)) };
    const fixture = TestBed.configureTestingModule({
      declarations: [AddressComponent],
      imports: [ReactiveFormsModule],
      providers: [{ provide: AddressLookup, useValue: stub }]
    }).createComponent(AddressComponent);

    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button'))
      .nativeElement as HTMLButtonElement;
    button.click();
    expect(stub.lookup).toHaveBeenCalled();
  });

  // real http endpoint
  it('should show nothing with a real HttpClient', () => {
    const get = (url: string, options: { params: HttpParams }) => {
      if (options.params.get('street') === 'Hauptstrasse 12') {
        return of([true]);
      } else {
        return of([]);
      }
    };

    const fixture = TestBed.configureTestingModule({
      declarations: [AddressComponent],
      imports: [ReactiveFormsModule, HttpClientModule]
      // providers: [{ provide: HttpClient, useValue: { get } }]
    }).createComponent(AddressComponent);

    fixture.componentInstance.formGroup = {
      value: {
        street: 'Lincoln Corner',
        streetNumber: 1
      }
    } as FormGroup;
    fixture.componentInstance.search();
    fixture.detectChanges();
    const lookupResult = fixture.debugElement.query(
      By.css('[data-test=lookup-result]')
    );
    expect(lookupResult).toBeNull();
  });

  // full component test with sync observable
  it('should not fail for Hauptstrasse with sync observable', () => {
    const lookup = address => {
      if (address.street === 'Hauptstrasse') {
        return of(true);
      }
    };

    const fixture = TestBed.configureTestingModule({
      declarations: [AddressComponent],
      imports: [ReactiveFormsModule],
      providers: [{ provide: AddressLookup, useValue: { lookup } }]
    }).createComponent(AddressComponent);

    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('[data-test=street]'))
      .nativeElement as HTMLInputElement;
    input.value = 'Hauptstrasse';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'))
      .nativeElement as HTMLButtonElement;
    button.click();
    fixture.detectChanges();
    const lookupResult = fixture.debugElement.query(
      By.css('[data-test=lookup-result]')
    ).nativeElement as HTMLElement;

    expect(lookupResult.textContent.trim()).toBe('Address found');
  });

  // full component test with async observable
  it('should not fail with async observable', fakeAsync(() => {
    const lookup = address => {
      if (address.street === 'Hauptstrasse') {
        return of(true).pipe(delay(0));
      }
    };

    const fixture = TestBed.configureTestingModule({
      declarations: [AddressComponent],
      imports: [ReactiveFormsModule],
      providers: [{ provide: AddressLookup, useValue: { lookup } }]
    }).createComponent(AddressComponent);

    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('[data-test=street]'))
      .nativeElement as HTMLInputElement;
    input.value = 'Hauptstrasse';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'))
      .nativeElement as HTMLButtonElement;
    button.click();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const lookupResult = fixture.debugElement.query(
      By.css('[data-test=lookup-result]')
    ).nativeElement as HTMLElement;

    expect(lookupResult.textContent.trim()).toBe('Address found');
  }));

  //kitchen sink (e2e)
  it('should check both not-validation and validated', fakeAsync(() => {
    const lookup = address =>
      of(address.street === 'Winkelgasse').pipe(delay(0), tap(console.log));

    const fixture = TestBed.configureTestingModule({
      declarations: [AddressComponent],
      imports: [ReactiveFormsModule],
      providers: [{ provide: AddressLookup, useValue: { lookup } }]
    }).createComponent(AddressComponent);

    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('[data-test=street]'))
      .nativeElement as HTMLInputElement;
    input.value = 'Diagon Alley';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'))
      .nativeElement as HTMLButtonElement;
    button.click();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const lookupResult = fixture.debugElement.query(
      By.css('[data-test=lookup-result]')
    ).nativeElement as HTMLElement;

    expect(lookupResult.textContent.trim()).toBe('Address not found');

    input.value = 'Winkelgasse';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    button.click();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    expect(lookupResult.textContent.trim()).toBe('Address found');
  }));

  // Snapshot
  it('should check the snapshot', () => {
    TestBed.configureTestingModule({
      declarations: [AddressComponent],
      imports: [ReactiveFormsModule],
      providers: [{ provide: AddressLookup, useValue: null }]
    });
    const fixture = TestBed.createComponent(AddressComponent);
    expect(fixture).toMatchSnapshot();
  });
});
