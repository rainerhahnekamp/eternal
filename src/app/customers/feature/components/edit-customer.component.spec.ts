import { computed, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { ComponentFixtureAutoDetect, flush, TestBed } from "@angular/core/testing";
import { EditCustomerComponent } from '@app/customers/feature/components/edit-customer.component';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { createCustomer } from '@app/customers/model';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { RouterTestingHarness } from '@angular/router/testing';
import { By } from "@angular/platform-browser";
import { provideNoopAnimations } from "@angular/platform-browser/animations";
import { provideNativeDateAdapter } from "@angular/material/core";

describe('Edit Customer', () => {
  it('should test ', async () => {
    const customer = createCustomer({ id: 1, firstname: 'John', name: 'Doe' });
    TestBed.configureTestingModule({
      imports: [EditCustomerComponent],
      providers: [
        {provide: ComponentFixtureAutoDetect, useValue: true},
        provideNativeDateAdapter(),
        provideNoopAnimations(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter(
          [
            {
              path: 'customer/:id',
              component: EditCustomerComponent,
            },
          ],
          withComponentInputBinding(),
        ),
        provideLocationMocks(),
      ],
    });

    const ctrl = TestBed.inject(HttpTestingController)
    const harness = await RouterTestingHarness.create('/customer/1');
    ctrl.expectOne('/customer/1').flush(customer);

    // alternatively
    await harness.fixture.whenStable();
    await harness.fixture.whenStable();

    const input: HTMLInputElement = harness.fixture.debugElement.query(By.css('[data-testid=inp-firstname]')).nativeElement;
    expect(input.value).toBe('John');
  });
});
