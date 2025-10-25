import { render } from '@testing-library/angular';
import NewsletterPage from './newsletter-page';
import { it, expect } from 'vitest';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { userEvent } from '@testing-library/user-event';
import { screen } from '@testing-library/angular';
import { TestBed } from '@angular/core/testing';

it('should subscribe', async () => {
  await render(NewsletterPage, {
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      provideRouter([]),
      provideLocationMocks(),
    ],
    componentInputs: {},
  });

  await userEvent.type(
    await screen.findByRole('textbox', { name: 'Address' }),
    'Domgasse 5',
  );
  await userEvent.click(
    await screen.findByRole('button', { name: 'Subscribe' }),
  );

  const ctrl = TestBed.inject(HttpTestingController);
  ctrl.expectOne('http://some.host.com/newsletter/subscribe').flush(true);

  const statusElement: HTMLParagraphElement = await screen.findByRole('status');
  screen.logTestingPlaygroundURL();
  expect(statusElement.textContent).toBe('Thank you for your subscription');
});
