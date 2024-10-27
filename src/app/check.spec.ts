import { expect } from '@jest/globals';
import { TestBed } from '@angular/core/testing';
import { NewsletterComponent } from './newsletter/newsletter.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

it('jest should work', () => {
  expect(true).toBe(true);
});

it('should test Newsletter', () => {
  const fixture = TestBed.configureTestingModule({
    imports: [NewsletterComponent, NoopAnimationsModule],
  }).createComponent(NewsletterComponent);

  fixture.detectChanges();
});
