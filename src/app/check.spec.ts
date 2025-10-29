import { TestBed } from '@angular/core/testing';
import NewsletterPage from './newsletter/newsletterPage';
import { it, expect } from 'vitest';

it('jest should work', () => {
  expect(true).toBe(true);
});

it('should test Newsletter', () => {
  const fixture = TestBed.configureTestingModule({
    imports: [NewsletterPage],
  }).createComponent(NewsletterPage);

  fixture.detectChanges();
});
