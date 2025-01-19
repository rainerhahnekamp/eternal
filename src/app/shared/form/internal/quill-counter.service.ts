import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class QuillCounter {
  #id = 1;

  nextInstanceId() {
    return `quill-editor-${this.#id++}`;
  }
}
