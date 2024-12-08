import { TestBed } from '@angular/core/testing';
import { NewsletterComponent } from './newsletter/newsletter.component';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

it('jest should work', () => {
  expect(true).toBe(true);
});

it('should test Newsletter', () => {
  const fixture = TestBed.configureTestingModule({
    imports: [NewsletterComponent],
    providers: [provideNoopAnimations()],
  }).createComponent(NewsletterComponent);

  fixture.detectChanges();
});
