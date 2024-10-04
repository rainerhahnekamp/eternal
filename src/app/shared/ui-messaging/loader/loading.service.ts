import { Injectable, signal } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class LoadingService {
  #loading = signal(false)
  loading = this.#loading.asReadonly();

  start() {
    this.#loading.set(true)

  }

  stop() {
    this.#loading.set(false)
  }
}
