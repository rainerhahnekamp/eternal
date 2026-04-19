import * as plugin from '../src/angular-architects';
import * as vitest from 'vitest';
import { RuleTester } from '@typescript-eslint/rule-tester';
import { capitalizeClass } from '../src/capitalize-class';

RuleTester.afterAll = vitest.afterAll;
RuleTester.it = vitest.it;
RuleTester.itOnly = vitest.it.only;
RuleTester.describe = vitest.describe;

const ruleTester = new RuleTester();

ruleTester.run('rule', capitalizeClass, {
  valid: ['class Person {}'],
  invalid: [
    {
      code: 'class person {}',
      errors: [
        {
          message: 'Class names have to be capitalized',
        },
      ],
      output: 'class Person {}',
    },
  ],
});
