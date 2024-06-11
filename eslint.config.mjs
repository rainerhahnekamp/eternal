// @ts-check

import tseslint from "typescript-eslint";
import eslint from "@eslint/js";
import unusedImports from "eslint-plugin-unused-imports";
import prettier from "eslint-plugin-prettier/recommended";
import appPlugin from "./eslint/app.plugin.mjs";

export default [...tseslint.config(eslint.configs.recommended, ...tseslint.configs.strict, ...tseslint.configs.stylistic,
  appPlugin.configs.default), prettier];
