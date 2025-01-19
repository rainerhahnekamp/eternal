import {
  afterNextRender,
  Component,
  ElementRef,
  inject,
  input,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import Quill from 'quill';
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
  protected quill: Quill | undefined;

  text = input.required<string>();

  quillEl = viewChild<ElementRef>('quill');

  constructor() {
    afterNextRender(() => {
      new Quill(this.quillEl()?.nativeElement, { theme: 'snow' });
    });
  }
}
