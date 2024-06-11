import type { ESLint, Rule } from 'eslint';
import unusedImports from 'eslint-plugin-unused-imports';

const classNameLength: Rule.RuleModule = {
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

const plugin = {
  rules: { 'class-name-length': classNameLength },
  configs: {} as ESLint.Plugin['configs']
} satisfies ESLint.Plugin

plugin.configs!['default'] = {
  plugins: { app: plugin, 'unused-imports': unusedImports },
  rules: {
    'app/class-name-length': 'error',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/consistent-type-imports': 'error',
    'unused-imports/no-unused-imports': 'error',
  },
};

export default plugin;
