import { Service } from '@angular/core';

@Service()
export class QuillCounter {
  #id = 1;

  nextInstanceId() {
    return `quill-editor-${this.#id++}`;
  }
}
