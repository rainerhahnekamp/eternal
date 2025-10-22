import { TestBed } from '@angular/core/testing';
import { expect, it } from 'vitest';
import NewsletterPage from './newsletter/newsletter-page';

it('vitest should work', () => {
  expect(true).toBe(true);
});

it('should test Newsletter', () => {
  const fixture = TestBed.createComponent(NewsletterPage);

  fixture.detectChanges();
});

it('should just work', () => {
  expect(true).toBe(true);
});
