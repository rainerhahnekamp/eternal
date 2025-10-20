import { Directive, ElementRef, inject } from '@angular/core';
import { ImagesLoadedService } from './images-loaded.service';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'img[app-img-loaded]',
  standalone: true,
})
export class ImageLoadedDirective {
  imagesLoadedService = inject(ImagesLoadedService);

  readonly #el = inject(ElementRef);
  constructor() {
    this.imagesLoadedService.register(
      this.#el.nativeElement as HTMLImageElement,
    );
  }
}
