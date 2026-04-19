import { createRule } from "./create-rule";

export const capitalizeClass = createRule({
  name: 'capitalize-class',
  defaultOptions: [],
  meta: {
    type: 'problem',
    docs: { description: 'Capitalize classes' },
    messages: {
      capitalizeClass: 'Class names have to be capitalized',
    },
    schema: [],
    fixable: 'code',
  },
  create(context) {
    return {
      ClassDeclaration(node) {
        const identifier = node.id;
        if (identifier && !/^[A-Z]/.test(identifier.name)) {
          const className = node.id?.name || '';
          context.report({
            node,
            messageId: 'capitalizeClass',
            fix: (fixer) => {
              return fixer.replaceTextRange(
                identifier.range,
                className.charAt(0).toUpperCase() + className.slice(1),
              );
            },
          });
        }
      },
    };
  },
});
