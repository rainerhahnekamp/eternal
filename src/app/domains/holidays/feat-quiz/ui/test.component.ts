import { Component, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-test',
  template: `
    <button mat-button (click)="clicked()">Click me</button>
    <p>{{ message() }}</p>
  `,
  standalone: true,
  imports: [MatButton],
})
export class TestComponent {
  readonly message = signal('');

  clicked() {
    this.message.set('You clicked me');
  }
}
