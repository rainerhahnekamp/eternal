import { Component, Input } from '@angular/core';

@Component({
  selector: 'lib-angular',
  template: `
    <p>
      angular works with {{title}} !
    </p>
  `,
  styles: [
  ]
})
export class AngularComponent {
  @Input() title = 'default';

}