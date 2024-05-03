import { render, screen } from '@testing-library/angular';
import {
  NewsletterComponent,
  SubNewsletterComponent,
} from '@app/newsletter/newsletter.component';
import { MockComponent } from 'ng-mocks';
import { createMock } from '@testing-library/angular/jest-utils';
import { HttpClient } from '@angular/common/http';
import userEvent from '@testing-library/user-event';
import { asyncScheduler, scheduled } from "rxjs";
import {expect} from "@jest/globals";

it('should subscribe', async () => {
  const httpClient = createMock(HttpClient);
  httpClient.post.mockReturnValue(scheduled([true], asyncScheduler))

  await render(NewsletterComponent, {
    imports: [MockComponent(SubNewsletterComponent)],
    providers: [{ provide: HttpClient, useValue: httpClient }],
  });

  const user = userEvent.setup();

  await user.type(
    screen.getByRole('textbox', {
      name: /email/i,
    }),
    'user@host.com',
  );
  await user.click(
    screen.getByRole('button', {
      name: /subscribe/i,
    }),
  );

  expect(await screen.findByText('Thank you for your subscription')).toBeDefined()
});
