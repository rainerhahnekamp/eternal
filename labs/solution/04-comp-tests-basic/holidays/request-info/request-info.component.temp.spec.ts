import { HttpClient } from '@angular/common/http';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { asyncScheduler, of, scheduled } from 'rxjs';
import { AddressLookuper } from '../../shared/address-lookuper.service';
import { assertType } from '../../shared/assert-type';
import { RequestInfoComponent } from './request-info.component';

describe('RequestInfo Component Temporary', () => {
  it('should check the title', () => {
    const fixture = TestBed.configureTestingModule({
      declarations: [RequestInfoComponent],
      imports: [ReactiveFormsModule],
      providers: [{ provide: AddressLookuper, useValue: null }]
    }).createComponent(RequestInfoComponent);
    fixture.detectChanges();

    const title = fixture.debugElement.query(By.css('h2')).nativeElement as HTMLElement;
    expect(title.textContent).toBe('Request More Information');

    fixture.componentInstance.title = 'Test Title';
    fixture.detectChanges();

    expect(title.textContent).toBe('Test Title');
  });

  it('should check input fields have right values', () => {
    TestBed.configureTestingModule({
      declarations: [RequestInfoComponent],
      imports: [ReactiveFormsModule],
      providers: [{ provide: AddressLookuper, useValue: null }]
    });
    const fixture = TestBed.createComponent(RequestInfoComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.formGroup.patchValue({
      address: 'Hauptstraße 5'
    });
    const address = fixture.debugElement.query(By.css('[data-test=address]'))
      .nativeElement as HTMLInputElement;

    expect(address.value).toBe('Hauptstraße 5');
  });

  it('should fail on no input', fakeAsync(() => {
    expect.hasAssertions();
    const fixture = TestBed.configureTestingModule({
      declarations: [RequestInfoComponent],
      imports: [ReactiveFormsModule],
      providers: [
        {
          provide: AddressLookuper,
          useValue: {
            lookup: () => scheduled([false], asyncScheduler)
          }
        }
      ]
    }).createComponent(RequestInfoComponent);

    fixture.detectChanges();
    fixture.componentInstance.search();
    tick();
    fixture.detectChanges();
    const lookupResult = fixture.debugElement.query(By.css('[data-test=lookup-result]'))
      .nativeElement as HTMLElement;
    expect(lookupResult.textContent).toContain('Address not found');
  }));

  it('should trigger search on click', fakeAsync(() => {
    const lookuper = { lookup: jest.fn(() => scheduled([false], asyncScheduler)) };
    const fixture = TestBed.configureTestingModule({
      declarations: [RequestInfoComponent],
      imports: [ReactiveFormsModule],
      providers: [{ provide: AddressLookuper, useValue: lookuper }]
    }).createComponent(RequestInfoComponent);

    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('[data-test=btn-search]'))
      .nativeElement as HTMLButtonElement;
    button.click();
    tick();

    expect(lookuper.lookup).toHaveBeenCalled();
  }));

  it('should check the snapshot', () => {
    TestBed.configureTestingModule({
      declarations: [RequestInfoComponent],
      imports: [ReactiveFormsModule],
      providers: [{ provide: AddressLookuper, useValue: null }]
    });
    const fixture = TestBed.createComponent(RequestInfoComponent);
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should verify that the address input sets the field value', fakeAsync(() => {
    const fixture = TestBed.configureTestingModule({
      declarations: [RequestInfoComponent],
      imports: [ReactiveFormsModule],
      providers: [{ provide: AddressLookuper, useValue: null }]
    }).createComponent(RequestInfoComponent);
    fixture.componentInstance.address = 'Domgasse 5';

    fixture.detectChanges();
    const field = fixture.debugElement.query(By.css('[data-test=address]'))
      .nativeElement as HTMLInputElement;

    expect(field.value).toBe('Domgasse 5');
  }));

  it('should do an integration test', fakeAsync(() => {
    const httpClient = assertType<HttpClient>({ get: () => of([true]) });
    const fixture = TestBed.configureTestingModule({
      declarations: [RequestInfoComponent],
      imports: [ReactiveFormsModule],
      providers: [{ provide: HttpClient, useValue: httpClient }]
    }).createComponent(RequestInfoComponent);

    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('[data-test=address]'))
      .nativeElement as HTMLInputElement;
    input.value = 'Domgasse 15';
    input.dispatchEvent(new Event('input'));
    fixture.componentInstance.search();
    tick();
    fixture.detectChanges();
    const lookupResult = fixture.debugElement.query(By.css('[data-test=lookup-result]'))
      .nativeElement as HTMLElement;

    expect(lookupResult.textContent).toContain('Brochure sent');
  }));
});
