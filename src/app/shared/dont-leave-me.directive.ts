import { Directive, ElementRef, HostListener } from '@angular/core';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Directive({
  selector: 'img[appDontLeaveMe]'
})
export class DontLeaveMeDirective {
  private dog = '/assets/dontleaveme.jpg';

  constructor(private el: ElementRef) {}

  @HostListener('mouseleave') onMouseLeave() {
    const img = this.el.nativeElement as HTMLImageElement;
    if (!img.src.endsWith(this.dog)) {
      const orig = img.src;
      img.src = this.dog;
      of(true)
        .pipe(delay(1500))
        .subscribe(() => (img.src = orig));
    }
  }
}
