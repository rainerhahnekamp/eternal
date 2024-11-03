import { ruleTester } from './rule-tester';
import { inputLimit } from '../src/input-limit';

ruleTester.run('rule', inputLimit, {
  valid: [
    `
class MyComponent {
  id = input.required<number>();
  name = input("");
}`,
    `
class MyComponent {
  id1 = 1
  id2 = input.required<number>();
  id3 = input.required<number>();
  id4 = input.required<number>();
  name = input("");
}`,
  ],
  invalid: [
    {
      code: `
class MyComponent {
  id1 = input.required<number>();
  id2 = input.required<number>();
  id3 = input.required<number>();
  id4 = input.required<number>();
  name = input("");
}`,
      errors: [{ messageId: 'inputLimit' }],
    },
  ],
});
