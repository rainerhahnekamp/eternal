import { ESLintUtils, TSESTree } from '@typescript-eslint/utils';
import { createRule } from "./create-rule";
import { capitalizeClass } from "./capitalize-class";
import { lowerCaseProperty } from "./lower-case-property";


export = {
  configs: {
    recommended: {
      plugins: {
        '@angular-architects': {
          rules: {
            'lower-case-property': lowerCaseProperty,
            'capitalize-class': capitalizeClass,
          },
        },
      },
      rules: {
        '@angular-architects/lower-case-property': 'error',
        '@angular-architects/capitalize-class': 'error',
      },
    }
  },

};
