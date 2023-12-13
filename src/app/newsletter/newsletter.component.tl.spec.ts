import { render, screen } from '@testing-library/angular';
import { NewsletterComponent } from '@app/newsletter/newsletter.component';
import { createMock } from '@testing-library/angular/jest-utils';
import { HttpClient } from '@angular/common/http';
import { userEvent } from '@testing-library/user-event';
import { asyncScheduler, scheduled } from 'rxjs';

it('should subscribe', async () => {
  const httpClient = createMock(HttpClient);
  httpClient.post.mockReturnValue(scheduled([true], asyncScheduler));
  const renderResult = await render(NewsletterComponent, {
    providers: [{ provide: HttpClient, useValue: httpClient }],
  });

  const user = userEvent.setup();

  await user.type(await screen.findByLabelText('EMail'), 'user@host.com');
  await user.click(await screen.findByRole('button', { name: 'Subscribe' }));
  screen.logTestingPlaygroundURL();

  await screen.findByText('Thank you for your subscription');
});
