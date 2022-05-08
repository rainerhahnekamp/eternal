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
});
