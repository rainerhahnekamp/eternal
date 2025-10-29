import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
  selector: '[appBlinker]',
  standalone: true,
})
export class BlinkerDirective {
  #currentColor = '';
  #intervalId: ReturnType<typeof setInterval> | undefined;

  readonly #el = inject(ElementRef);

  @HostListener('mouseenter') onMouseEnter() {
    this.toggle();
    this.#intervalId = setInterval(() => this.toggle(), 500);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.#el.nativeElement.style.backgroundColor = '';
    if (this.#intervalId) {
      clearInterval(this.#intervalId);
      this.#intervalId = undefined;
    }
  }

  private toggle() {
    const color = this.#currentColor === '' ? 'coral' : '';
    this.#currentColor = color;
    this.#el.nativeElement.style.backgroundColor = color;
  }
}
