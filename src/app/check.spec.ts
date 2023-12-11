import { TestBed } from '@angular/core/testing';
import { NewsletterComponent } from '@app/newsletter/newsletter.component';

it('jest should work', () => {
  expect(true).toBe(true);
});

it('should test Newsletter', () => {
  const fixture = TestBed.configureTestingModule({
    imports: [NewsletterComponent],
  }).createComponent(NewsletterComponent);

  fixture.detectChanges();
});
