/// <reference types="vitest" />
import { defineConfig } from "vite";

import angular from "@analogjs/vite-plugin-angular";
import { playwright } from "@vitest/browser-playwright";
import viteTsConfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => ({
  plugins: [angular(), viteTsConfigPaths()],
  test: {
    globals: true,
    setupFiles: ["src/test-setup.ts"],
    // environment: 'jsdom',
    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    reporters: ["default"],
    testTimeout: 5000,
    // Vitest browser config
    browser: {
      trace: "on",
      enabled: true,
      headless: false,
      provider: playwright(),
      instances: [{ browser: "chromium" }],
    },
  },
}));
