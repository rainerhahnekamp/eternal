import { defineConfig } from 'cypress';
import { writeFile } from 'fs/promises';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    experimentalWebKitSupport: true,
    env: {
      loginUsername: 'john.list',
      loginPassword: 'John List',
    },
    setupNodeEvents(on) {
      on('task', {
        saveCustomers: async (customers: string[]) => {
          await writeFile('customers.txt', customers.join('\n'));
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
