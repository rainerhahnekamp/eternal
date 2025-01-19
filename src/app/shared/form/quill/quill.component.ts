import {
  afterNextRender,
  Component,
  ElementRef,
  inject,
  input,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { QuillCounter } from '../internal/quill-counter.service';

@Component({
  selector: 'app-quill',
  template: ` <div #quill>{{ text() }}</div>`,
  styleUrl: './quill.component.scss',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
})
export class QuillComponent {
  protected readonly quillId = inject(QuillCounter).nextInstanceId();
  protected quill: unknown;

  text = input.required<string>();

  quillEl = viewChild<ElementRef>('quill');

  constructor() {
    afterNextRender(() => {
      import('quill').then(
        (m) => new m.default(this.quillEl()?.nativeElement, { theme: 'snow' }),
      );
    });
  }
}
