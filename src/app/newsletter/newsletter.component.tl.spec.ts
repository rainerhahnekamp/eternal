import { waitForAsync } from '@angular/core/testing';
import { render, screen } from '@testing-library/angular';
import {
  HomeLinkComponent,
  NewsletterComponent,
} from '@app/newsletter/newsletter.component';
import { MockComponent } from 'ng-mocks';
import { createMock } from '@testing-library/angular/jest-utils';
import { HttpClient } from '@angular/common/http';
import userEvent from '@testing-library/user-event';
import { asyncScheduler, scheduled } from "rxjs";

it('should subscribe', async () => {
  const httpClient = createMock(HttpClient);
  httpClient.post.mockReturnValue(scheduled([true], asyncScheduler));
  const renderResult = await render(NewsletterComponent, {
    imports: [MockComponent(HomeLinkComponent)],
    providers: [{ provide: HttpClient, useValue: httpClient }],
  });

  const user = userEvent.setup();

  await user.type(screen.getByRole('textbox', { name: /email/i }), 'user@host.com')
  await user.click(screen.getByRole('button', {name: 'Subscribe'}));

  expect(await screen.findByText('Thank you for your subscription')).toBeDefined();
});
