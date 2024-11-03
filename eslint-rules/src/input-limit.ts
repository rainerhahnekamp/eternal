import { ESLintUtils, TSESTree } from '@typescript-eslint/utils';

const createRule = ESLintUtils.RuleCreator((name) => name);

export const inputLimit = createRule({
  name: 'input-limit',
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce an input limit of 4',
    },
    messages: {
      inputLimit: 'Component should not have more than 4 input calls',
    },
    schema: [],
  },
  defaultOptions: [],
  create: (context) => ({
    ClassDeclaration(node) {
      const inputCalls = node.body.body.filter((node: TSESTree.Node) => {
        if (
          node.type === 'PropertyDefinition' &&
          node.value?.type === 'CallExpression'
        ) {
          const callee = node.value.callee;
          if (callee.type === 'Identifier') {
            return callee.name === 'input';
          } else if (callee.type === 'MemberExpression') {
            return (
              callee.object.type === 'Identifier' &&
              callee.object.name === 'input'
            );
          }
        }
        return false;
      });

      if (inputCalls.length > 4) {
        context.report({
          node: inputCalls[4],
          messageId: 'inputLimit',
        });
      }
    },
  }),
});
