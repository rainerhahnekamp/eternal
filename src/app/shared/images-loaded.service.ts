import { Injectable } from '@angular/core';
import { distinctUntilChanged, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ImagesLoadedService {
  runningId = 0;
  loadingImages = new Set<number>();

  #loaded$ = new Subject<boolean>();
  loaded$ = this.#loaded$.asObservable().pipe(distinctUntilChanged());

  register(img: HTMLImageElement) {
    const id = this.runningId++;
    this.loadingImages.add(id);
    img.addEventListener('load', () => {
      this.loadingImages.delete(id);
      if (this.loadingImages.size === 0) {
        this.#loaded$.next(true);
      }
    });
    this.#loaded$.next(false);
  }
}
