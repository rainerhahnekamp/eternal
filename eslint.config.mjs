// @ts-check

import tseslint from "typescript-eslint";
import eslint from "@eslint/js";
import unusedImports from "eslint-plugin-unused-imports";
import prettier from "eslint-plugin-prettier/recommended";


export default [...tseslint.config(eslint.configs.recommended, ...tseslint.configs.strict, ...tseslint.configs.stylistic,
  {
    plugins: { "unused-imports": unusedImports },
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { "varsIgnorePattern": "^_" }],
      "@typescript-eslint/consistent-type-imports": "error",
      "unused-imports/no-unused-imports": "error"
    }
  }), prettier];
