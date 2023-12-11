/// <reference types="vitest" />

import analog from '@analogjs/platform';
import { defineConfig } from 'vite';
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [analog()],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['src/test-setup.ts'],
      include: ['src/app/**/*.spec.ts'],
    },
    define: {
      'import.meta.vitest': mode !== 'production',
    },
    resolve: {
      alias: {
        "@app": path.resolve(__dirname, "./src/app"),
      },
    },
  };
});
