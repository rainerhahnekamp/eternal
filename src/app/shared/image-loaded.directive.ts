import { Directive, ElementRef, inject } from '@angular/core';
import { ImagesLoadedService } from './images-loaded.service';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'img',
  standalone: true,
})
export class ImageLoadedDirective {
  imagesLoadedService = inject(ImagesLoadedService);
  constructor(el: ElementRef) {
    this.imagesLoadedService.register(el.nativeElement as HTMLImageElement);
  }
}
