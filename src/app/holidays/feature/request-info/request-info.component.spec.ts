import { fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { RequestInfoComponent } from '@app/holidays/feature/request-info/request-info.component';
import { By } from '@angular/platform-browser';
import { createMock } from '@testing-library/angular/jest-utils';
import { HttpClient } from '@angular/common/http';
import {
  NoopAnimationsModule,
  provideNoopAnimations,
} from '@angular/platform-browser/animations';
import { asyncScheduler, of, scheduled } from 'rxjs';
import { delay } from 'rxjs/operators';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatInputHarness } from '@angular/material/input/testing';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

describe('Request Info Component', () => {
  describe('Harness', () => {
    const setup = () => {
      const httpClient = createMock(HttpClient);
      const fixture = TestBed.configureTestingModule({
        providers: [
          { provide: HttpClient, useValue: httpClient },
          provideNoopAnimations(),
        ],
        imports: [RequestInfoComponent],
      }).createComponent(RequestInfoComponent);

      fixture.autoDetectChanges(true);
      return { fixture, httpClient };
    };

    it('should have a verified address', async () => {
      const { fixture, httpClient } = setup();
      httpClient.get.mockReturnValue(of(['Domgasse 5']).pipe(delay(500)));

      const loader = TestbedHarnessEnvironment.loader(fixture);
      const input = await loader.getHarness(MatInputHarness);

      const button: HTMLButtonElement = fixture.debugElement.query(
        By.css('[data-testid=btn-search]'),
      ).nativeElement;

      await input.setValue('Domgasse 5');
      button.click();

      await fixture.whenStable();
      const message: HTMLParagraphElement = fixture.debugElement.query(
        By.css('[data-testid=lookup-result]'),
      ).nativeElement;

      expect(message.textContent?.trim()).toBe('Brochure sent');
    });
  });

  describe('Testing Library', () => {
    it('should have a verified address', async () => {
      const httpClient = createMock(HttpClient);

      httpClient.get.mockReturnValue(
        scheduled([['Domgasse 5']], asyncScheduler),
      );
      await render(RequestInfoComponent, {
        providers: [
          provideNoopAnimations(),
          { provide: HttpClient, useValue: httpClient },
        ],
      });

      const user = userEvent.setup();

      await user.type(screen.getByRole('textbox'), 'Domgasse 5');
      await user.click(screen.getByRole('button', { name: 'Send' }));
      expect((await screen.findByRole('status')).textContent?.trim()).toBe(
        'Brochure sent',
      );
    });
  });
});
