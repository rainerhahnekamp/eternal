import { fakeAsync, tick } from '@angular/core/testing';
import { createDirectiveFactory } from '@ngneat/spectator/jest';
import { DontLeaveMeDirective } from './dont-leave-me.directive';

describe("Don't leave me", () => {
  const createDirective = createDirectiveFactory(DontLeaveMeDirective);

  it('should show the dog image', () => {
    const spectator = createDirective('<img appDontLeaveMe src="/dummy.jpg">');
    spectator.dispatchMouseEvent(spectator.element, 'mouseleave');

    expect(spectator.element).toHaveAttribute('src', '/assets/dontleaveme.jpg');
  });

  it('should revert to original after 1.5 seconds', fakeAsync(() => {
    const spectator = createDirective('<img appDontLeaveMe src="/dummy.jpg">');
    spectator.dispatchMouseEvent(spectator.element, 'mouseleave');
    tick(1500);
    expect(spectator.element).toHaveAttribute('src', 'http://localhost/dummy.jpg');
  }));
});
