import { ruleTester } from './rule-tester';
import { readonlyPrefix } from '../src/readonly-prefix';

ruleTester.run('rule', readonlyPrefix, {
  valid: [
    `
class MyComponent {
  readonly id = 1;
  vName = "";
}`,
  ],
  invalid: [
    {
      code: `
class MyComponent {
  id = 1;
  vName = "";
}
  `,
      errors: [{ messageId: 'readonlyPrefix' }],
      output: `
class MyComponent {
  readonly id = 1;
  vName = "";
}
  `,
    },
  ],
});
