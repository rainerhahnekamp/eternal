import { ESLintUtils } from '@typescript-eslint/utils';
import { TSESTree } from '@typescript-eslint/typescript-estree';

const createRule = ESLintUtils.RuleCreator((name) => name);

export const readonlyPrefix = createRule({
  name: 'readonly-prefix',
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce readonly prefix',
    },
    messages: {
      readonlyPrefix: 'Property should have a readonly prefix',
    },
    schema: [],
    fixable: 'code',
  },
  defaultOptions: [],
  create: (context) => {
    return {
      'ClassDeclaration PropertyDefinition': (
        node: TSESTree.PropertyDefinition,
      ) => {
        if (
          !node.readonly &&
          node.key.type === 'Identifier' &&
          !node.key.name.startsWith('v')
        ) {
          context.report({
            node,
            messageId: 'readonlyPrefix',
            fix(fixer) {
              return fixer.insertTextBefore(node, 'readonly ');
            },
          });
        }
      },
    };
  },
});
