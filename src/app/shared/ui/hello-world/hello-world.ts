import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-hello-world',
  template: `<p>Hello World</p>`,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HelloWorldComponent {}
