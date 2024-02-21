import { TestBed } from '@angular/core/testing';
import { RequestInfoComponent } from '@app/holidays/feature/request-info/request-info.component';
import { createMock } from '@testing-library/angular/jest-utils';
import { HttpClient } from '@angular/common/http';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { RequestInfoComponentHarness } from '@app/holidays/feature/request-info/request-info.component.harness';
import { asyncScheduler, scheduled } from 'rxjs';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { By } from '@angular/platform-browser';

describe('RequestInfo Harness', () => {
  it('should send a brochure', async () => {
    const httpClient = createMock(HttpClient);
    httpClient.get.mockReturnValue(scheduled([[true]], asyncScheduler));
    const fixture = TestBed.configureTestingModule({
      imports: [RequestInfoComponent],
      providers: [
        { provide: HttpClient, useValue: httpClient },
        provideNoopAnimations(),
      ],
    }).createComponent(RequestInfoComponent);
    fixture.detectChanges();

    const harness = await TestbedHarnessEnvironment.harnessForFixture(
      fixture,
      RequestInfoComponentHarness,
    );

    await harness.writeAddress('Domgasse 5');
    await harness.search();
    expect(await harness.getResult()).toBe('Brochure sent');
  });

  it('should send a brochure', async () => {
    const httpClient = createMock(HttpClient);
    httpClient.get.mockReturnValue(scheduled([[true]], asyncScheduler));
    const fixture = TestBed.configureTestingModule({
      imports: [RequestInfoComponent],
      providers: [
        { provide: HttpClient, useValue: httpClient },
        provideNoopAnimations(),
      ],
    }).createComponent(RequestInfoComponent);
    fixture.detectChanges();

    const loader = TestbedHarnessEnvironment.loader(fixture);
    const input = await loader.getHarness(MatInputHarness);
    await input.setValue('Domgasse 5');

    const button = await loader.getHarness(
      MatButtonHarness.with({ selector: '[data-testid=btn-search]' }),
    );
    await button.click();

    const message: HTMLParagraphElement = fixture.debugElement.query(
      By.css('[data-testid=lookup-result]'),
    ).nativeElement;
    expect(message.textContent?.trim()).toBe('Brochure sent');
  });
});
