import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  input,
  resource,
  signal,
} from '@angular/core';
import { marked } from 'marked';

@Component({
  selector: 'app-markdown',
  template: ` <div [class]="className()" [innerHTML]="html.value()"></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .not-hydrated {
      background: grey;
      border: darkred 2px solid;
    }
  `,
  imports: [],
})
export class MarkdownComponent {
  readonly markdown = input.required<string>();

  protected readonly html = resource({
    request: this.markdown,
    defaultValue: '',
    loader: () => marked.parse(this.markdown(), { async: true }),
  });

  protected readonly className = signal('not-hydrated');

  constructor() {
    afterNextRender(() => {
      this.className.set('hydrated');
    });
  }
}
