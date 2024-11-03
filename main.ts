import { input } from '@angular/core';

class Foo {
  id = 1;
  vName = 'Fritz';
}

new Foo();

class MyComponent {
  readonly id1 = 1;
  readonly id2 = input.required<number>();
  readonly id3 = input.required<number>();
  readonly id4 = input.required<number>();
  readonly name = input('');
}
