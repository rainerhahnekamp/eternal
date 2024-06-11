import type { Rule } from 'eslint';

export const classNameLength: Rule.RuleModule = {
  create: (context) => ({
    ClassDeclaration(node) {
      console.log(node.id);
      console.log(context.sourceCode.text);
      if (node.id.name.length > 10) {
        context.report({
          node,
          message: 'Classname is not allowed to have more than 5 characters',
        });
      }
    },
  }),
};
