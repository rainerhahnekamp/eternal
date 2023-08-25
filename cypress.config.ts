import { defineConfig } from 'cypress';
import { writeFile } from 'fs/promises';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    experimentalWebKitSupport: true,
    setupNodeEvents: (on) => {
      on('task', {
        saveCustomers: async (customers: string[]) => {
          await writeFile('customers.txt', customers.join('\n'));
          return true;
        },
      });
    },

    env: {
      loginUsernameStandard: 'john.list@host.com',
      loginPasswordStandard: 'John List',
      loginUsernameAdmin: 'anna.brecht@host.com',
      loginPasswordAdmin: 'Anna Brecht',
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
