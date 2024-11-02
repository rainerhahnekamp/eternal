import { ESLintUtils } from "@typescript-eslint/utils";

export const createRule = ESLintUtils.RuleCreator(
  (name) => `http://mycompany.com/eslint/docs/${name}.md`,
);
