
import {Directive, ElementRef, HostListener, NgModule} from "@angular/core";

@Directive({
  selector: '[eternalBlinker]'
})
export class BlinkerDirective {
  currentColor = '';
  intervalId: number | undefined;
  constructor(private el: ElementRef) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.toggle();
    this.intervalId = window.setInterval(() => this.toggle(), 500);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.el.nativeElement.style.backgroundColor = '';
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  private toggle() {
    const color = this.currentColor === '' ? 'coral' : '';
    this.currentColor = color;
    this.el.nativeElement.style.backgroundColor = color;
  }
}

@NgModule({
  declarations: [BlinkerDirective],
  exports: [BlinkerDirective]
})
export class BlinkerDirectiveModule {

}
