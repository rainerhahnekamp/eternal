import { fakeAsync, TestBed, tick } from "@angular/core/testing";
import { NewsletterComponent } from '@app/newsletter/newsletter.component';

describe('check', () => {
  it('jest should work', () => {
    expect(true).toBe(true);
  });

  it('should test Newsletter', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [NewsletterComponent],
    }).createComponent(NewsletterComponent);

    fixture.detectChanges();
  });

  it('should not work', fakeAsync(() => {
    let a = 1;
    setTimeout(() => {
      a += 1;
    });
    tick()
    expect(a).toBe(2);
  }));
});
