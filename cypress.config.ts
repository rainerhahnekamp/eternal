import { defineConfig } from 'cypress';
import * as fs from 'fs/promises';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    experimentalWebKitSupport: true,
    env: {
      LOGIN_USERNAME: 'john.list',
      LOGIN_PASSWORD: 'John List',
    },
    setupNodeEvents(on) {
      on('task', {
        async log(message: string) {
          await fs.writeFile('cypress.log', message);
          return true;
        },
      });
    },
  },

  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack',
    },
    specPattern: '**/*.cy.ts',
  },
});
