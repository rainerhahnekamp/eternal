import { fakeAsync, tick } from '@angular/core/testing';
import { createDirectiveFactory, SpectatorDirective } from '@ngneat/spectator/jest';
import { BlinkerDirective } from './blinker.directive';

describe('Blinker', () => {
  const createDirective = createDirectiveFactory(BlinkerDirective);
  let spectator: SpectatorDirective<BlinkerDirective>;
  beforeEach(() => {
    spectator = createDirective(`<div eternalBlinker></div>`);
  });

  it('should show change the background colour', fakeAsync(() => {
    spectator.dispatchMouseEvent(spectator.element, 'mouseenter');
    expect(spectator.element).toHaveStyle({ backgroundColor: 'coral' });
    spectator.dispatchMouseEvent(spectator.element, 'mouseleave');
    tick();
  }));

  it('should revert blink after 0.5 seconds', fakeAsync(() => {
    spectator.dispatchMouseEvent(spectator.element, 'mouseenter');
    tick(500);
    expect(spectator.element).not.toHaveStyle({ backgroundColor: 'coral' });
    spectator.dispatchMouseEvent(spectator.element, 'mouseleave');
    tick();
  }));
});
