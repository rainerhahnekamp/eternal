import appPlugin from "./app.plugin";
import * as vitest from 'vitest';
import { RuleTester } from '@typescript-eslint/rule-tester';

RuleTester.afterAll = vitest.afterAll;

// If you are not using vitest with globals: true (https://vitest.dev/config/#globals):
RuleTester.it = vitest.it;
RuleTester.itOnly = vitest.it.only;
RuleTester.describe = vitest.describe;

const ruleTester = new RuleTester();

ruleTester.run('my-rule', appPlugin.rules["class-name-length"], {
  valid: [
    'class Person {}',
  ],
  invalid: [
    {
      code: 'class PersonIsTooLong {}',
      errors: [
        {
          message: 'Classname is not allowed to have more than 5 characters'
        },
      ],
    }
  ],
});
