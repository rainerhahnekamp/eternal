import { TestBed } from '@angular/core/testing';
import { RequestBrochurePage } from './request-brochure-page';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideLocationMocks } from '@angular/common/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatInputHarness } from '@angular/material/input/testing';
import { userEvent } from '@testing-library/user-event';
import { screen } from '@testing-library/dom';

describe('RequestBrochurePage', () => {
  it('should find the address (native)', async () => {
    TestBed.configureTestingModule({
      imports: [RequestBrochurePage],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([
          { path: 'holidays/brochure', component: RequestBrochurePage },
        ]),
        provideLocationMocks(),
      ],
    });

    const { fixture } = await RouterTestingHarness.create('/holidays/brochure');
    const ctrl = TestBed.inject(HttpTestingController);

    const input = fixture.debugElement.query(By.css('[data-testid=address]'))
      .nativeElement as HTMLInputElement;
    input.value = 'Domgasse 5';
    input.dispatchEvent(new Event('input'));

    const button = fixture.debugElement.query(
      By.css('[data-testid=btn-search'),
    ).nativeElement;
    button.click();

    await new Promise((resolve) => setTimeout(resolve));
    ctrl
      .expectOne(
        'https://nominatim.openstreetmap.org/search.php?format=jsonv2&q=Domgasse%205',
      )
      .flush([true]);

    await fixture.whenStable();

    const msg = fixture.debugElement.query(
      By.css('[data-testid=lookup-result]'),
    ).nativeElement as HTMLParagraphElement;
    expect(msg.textContent).toContain('Brochure sent');
  });

  it('should find the address (Testing Harness)', async () => {
    TestBed.configureTestingModule({
      imports: [RequestBrochurePage],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([
          { path: 'holidays/brochure', component: RequestBrochurePage },
        ]),
        provideLocationMocks(),
      ],
    });

    const { fixture } = await RouterTestingHarness.create('/holidays/brochure');
    const ctrl = TestBed.inject(HttpTestingController);

    const loader = TestbedHarnessEnvironment.loader(fixture);
    const harness = await loader.getHarness(MatInputHarness);

    await harness.setValue('Domgasse 5');
    const button = fixture.debugElement.query(
      By.css('[data-testid=btn-search'),
    ).nativeElement;
    button.click();

    await new Promise((resolve) => setTimeout(resolve));
    ctrl
      .expectOne(
        'https://nominatim.openstreetmap.org/search.php?format=jsonv2&q=Domgasse%205',
      )
      .flush([true]);

    await fixture.whenStable();

    const msg = fixture.debugElement.query(
      By.css('[data-testid=lookup-result]'),
    ).nativeElement as HTMLParagraphElement;
    expect(msg.textContent).toContain('Brochure sent');
  });

  it('should find the address (Testing Library)', async () => {
    TestBed.configureTestingModule({
      imports: [RequestBrochurePage],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([
          { path: 'holidays/brochure', component: RequestBrochurePage },
        ]),
        provideLocationMocks(),
      ],
    });

    const { fixture } = await RouterTestingHarness.create('/holidays/brochure');
    const user = userEvent.setup();
    const ctrl = TestBed.inject(HttpTestingController);

    const loader = TestbedHarnessEnvironment.loader(fixture);

    await user.type(screen.getByRole('textbox'), 'Domgasse 5');
    await user.click(screen.getByRole('button', { name: 'Send' }));

    ctrl
      .expectOne(
        'https://nominatim.openstreetmap.org/search.php?format=jsonv2&q=Domgasse%205',
      )
      .flush([true]);

    await fixture.whenStable();

    const msg = screen.getByRole('status');
    expect(msg.textContent).toContain('Brochure sent');
  });
});
