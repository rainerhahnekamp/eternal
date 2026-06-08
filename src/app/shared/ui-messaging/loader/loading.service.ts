import { Service, signal } from '@angular/core';

@Service()
export class LoadingService {
  readonly #loading = signal(false);
  readonly loading = this.#loading.asReadonly();

  start() {
    this.#loading.set(true);
  }

  stop() {
    this.#loading.set(false);
  }
}
