import { TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HttpClient } from '@angular/common/http';
import { createMock } from '@testing-library/angular/jest-utils';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { By } from '@angular/platform-browser';
import { RequestInfoComponent } from './request-info.component';
import { RequestInfoComponentHarness } from './request-info.component.harness';

describe('Request Info', () => {
  it('should request a holiday', async () => {
    const httpClient = createMock(HttpClient);
    const fixture = TestBed.configureTestingModule({
      imports: [RequestInfoComponent],
      providers: [
        provideNoopAnimations(),
        { provide: HttpClient, useValue: httpClient },
      ],
    }).createComponent(RequestInfoComponent);
    httpClient.get.mockReturnValue(of([true]).pipe(delay(0)));

    const harness = await TestbedHarnessEnvironment.harnessForFixture(
      fixture,
      RequestInfoComponentHarness,
    );

    await harness.writeAddress('Domgasse 5');
    await harness.search();
    expect(await harness.getResult()).toBe('Brochure sent');
  });

  it('should use the Material Harnesses', async () => {
    const httpClient = createMock(HttpClient);
    const fixture = TestBed.configureTestingModule({
      imports: [RequestInfoComponent],
      providers: [
        provideNoopAnimations(),
        { provide: HttpClient, useValue: httpClient },
      ],
    }).createComponent(RequestInfoComponent);
    httpClient.get.mockReturnValue(of([true]).pipe(delay(0)));

    const loader = TestbedHarnessEnvironment.loader(fixture);

    const input = await loader.getHarness(MatInputHarness);
    await input.setValue('Domgasse 5');

    const button = await loader.getHarness(
      MatButtonHarness.with({ selector: '[data-testid=btn-search]' }),
    );
    await button.click();
    await fixture.whenStable();

    const lookup: HTMLParagraphElement = fixture.debugElement.query(
      By.css('[data-testid=lookup-result]'),
    ).nativeElement;
    expect(lookup.textContent).toContain('Brochure sent');
  });
});
