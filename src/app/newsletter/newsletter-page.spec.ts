import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { page } from 'vitest/browser';
import NewsletterPage from './newsletter-page';

describe('Newsletter Page', () => {
  const setup = async (waitForStable = true) => {
    const fixture = TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    }).createComponent(NewsletterPage);
    if (waitForStable) {
      await fixture.whenStable();
    }

    const ctrl = TestBed.inject(HttpTestingController);

    return { fixture, ctrl };
  };
  it('should instantiate', async () => {
    await setup();
  });

  it('should not subscribe', async () => {
    await setup();

    await page.getByRole('button', { name: 'Subscribe' }).click();
    await expect
      .element(page.getByRole('status'))
      .toHaveTextContent('Please provide an email');
  });

  it('should subscribe', async () => {
    const { ctrl, fixture } = await setup();

    await page.getByRole('textbox').fill('user@host.com');
    await page.getByRole('button', { name: 'Subscribe' }).click();

    ctrl.expectOne('http://some.host.com/newsletter/subscribe').flush(true);

    await expect
      .element(page.getByRole('status'))
      .toHaveTextContent('Thank you for your subscription');
  });
});
