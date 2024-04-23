import { render, screen } from '@testing-library/angular';
import { it } from '@jest/globals';
import { NewsletterComponent } from '@app/newsletter/newsletter.component';
import { MockComponent } from 'ng-mocks';
import { SubComponent } from '@app/newsletter/sub.component';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { HttpClient } from '@angular/common/http';
import { createMock } from '@testing-library/angular/jest-utils';
import userEvent from '@testing-library/user-event';
import { asyncScheduler, scheduled } from 'rxjs';

it('should subscribe', async () => {
  const httpClientMock = createMock(HttpClient);
  await render(NewsletterComponent, {
    imports: [MockComponent(SubComponent)],

    providers: [
      provideNoopAnimations(),
      { provide: HttpClient, useValue: httpClientMock },
    ],
  });

  httpClientMock.post.mockReturnValue(scheduled([true], asyncScheduler));

  const user = userEvent.setup();
  await user.type(
    screen.getByRole('textbox', { name: 'E-Mail' }),
    'user@host.com',
  );
  await user.click(screen.getByRole('button', { name: 'Subscribe' }));

  expect((await screen.findByRole('status')).textContent).toBe(
    'Thank you for your subscription',
  );
});
