import { render, screen } from '@testing-library/angular';
import {
  NewsletterComponent,
  SubComponent,
} from '@app/newsletter/newsletter.component';
import { createMock } from '@testing-library/angular/jest-utils';
import { HttpClient } from '@angular/common/http';
import { MockComponent } from 'ng-mocks';
import userEvent from '@testing-library/user-event';
import { asyncScheduler, scheduled } from 'rxjs';

describe('Newsletter', () => {
  it('should subscribe', async () => {
    const httpClient = createMock(HttpClient);
    httpClient.post.mockReturnValue(scheduled([true], asyncScheduler));

    await render(NewsletterComponent, {
      imports: [MockComponent(SubComponent)],
      providers: [{ provide: HttpClient, useValue: httpClient }],
    });

    const user = userEvent.setup();

    await user.type(screen.getByLabelText('EMail'), 'user@host.com');
    await user.click(screen.getByRole('button', { name: 'Subscribe' }));
    await screen.findByText('Thank you for your subscriptions');
  });
});
