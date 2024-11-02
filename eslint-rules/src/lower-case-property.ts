import { createRule } from "./create-rule";
import { TSESTree } from "@typescript-eslint/utils";

export const lowerCaseProperty = createRule({
  name: 'lower-case-property',
  defaultOptions: [],
  meta: {
    type: 'problem',
    docs: {
      description: 'Class Properties show start with a lowercase character',
    },
    messages: {
      lowerCaseProperty: '{{ propertyName }} should be {{ fixedPropertyName }}',
    },
    schema: [],
    fixable: 'code',
  },
  create(context) {
    return {
      'ExportNamedDeclaration PropertyDefinition Identifier': (
        node: TSESTree.Identifier,
      ) => {
        // Check if the property name starts with a capital letter
        if (/^[A-Z]/.test(node.name)) {
          const fixedPropertyName =
            node.name.charAt(0).toLowerCase() + node.name.slice(1);
          context.report({
            node,
            messageId: 'lowerCaseProperty',
            data: {
              propertyName: node.name,
              fixedPropertyName,
            },
            fix(fixer) {
              return fixer.replaceText(node, fixedPropertyName);
            },
          });
        }
      },
    };
  },
});
