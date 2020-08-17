import { TestBed, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AddressComponent } from './address.component';
import { By } from '@angular/platform-browser';

describe('Test Address input', () => {
  it('should check for fields input and output', () => {
    const lookupFn = (street: string, streetNumber: string) => {
      if (street === 'Jameson Street' && streetNumber === '5') {
        return true;
      } else {
        return null;
      }
    };

    const lookup = { lookup: lookupFn };
    const component = new AddressComponent(lookup, null);
    component.search();

    expect(component.search()).toBeTruthy();
  });

  it('should check error handling when offline', () => true);

  it('should allow a user to submit an unknown address', () => true);
  it('should show multiple addresses and provide a selection', () => true);

  it('should check the snapshot', () => {
    TestBed.configureTestingModule({
      declarations: [AddressComponent],
      imports: [ReactiveFormsModule]
    });
    const fixture = TestBed.createComponent(AddressComponent);
    expect(fixture).toMatchSnapshot();
  });

  it('should check layout with input', () => {
    TestBed.configureTestingModule({
      declarations: [AddressComponent],
      imports: [ReactiveFormsModule]
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

  it('should test paragraph text', () => {
    const fixture = TestBed.configureTestingModule({
      declarations: [AddressComponent],
      imports: [ReactiveFormsModule]
    }).createComponent(AddressComponent);

    fixture.detectChanges();

    const p = fixture.debugElement.query(By.css('p'))
      .nativeElement as HTMLElement;
    expect(p.textContent).toBe('Address Validation');

    fixture.componentInstance.title = 'Validator';
    fixture.detectChanges();
    expect(p.textContent).toBe('Validator');
  });
});
