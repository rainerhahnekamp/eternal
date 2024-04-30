import { screen, render } from '@testing-library/angular';
import { NewsletterComponent } from '@app/newsletter/newsletter.component';
import { createMock, provideMock } from '@testing-library/angular/jest-utils';
import { HttpClient } from '@angular/common/http';
import { userEvent } from '@testing-library/user-event';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

it('should test Newsletter', async () => {
  const httpClient = createMock(HttpClient);
  await render(NewsletterComponent, {
    providers: [{ provide: HttpClient, useValue: httpClient }],
  });
  httpClient.post.mockReturnValue(of(true).pipe(delay(0)));

  const user = userEvent.setup();

  await user.type(screen.getByRole('textbox'), 'user@host.com');
  await user.click(screen.getByRole('button', { name: 'Subscribe' }));
  await screen.findByText('Thank you for your subscription');
});
