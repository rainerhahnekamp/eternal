import { defineConfig } from 'cypress';


import * as fs from "fs/promises"
import * as path from "path"


export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    experimentalWebKitSupport: true,
    setupNodeEvents(on) {
      on('task', {
        async saveCustomers(customerNames: string[]) {
          await fs.writeFile(path.join(__dirname, 'customers.txt'), customerNames)
          return customerNames.length
        }
      })
    },
    env: {
      LOGIN_ADMIN_USERNAME: 'john.list@host.com',
      LOGIN_ADMIN_PASSWORD: 'John List',
    }
  },

  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack',
    },
    specPattern: '**/*.cy.ts',
  },
});
