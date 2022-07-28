import { defineConfig } from 'cypress';
import { devServer } from './projects/angular-dev-server/src/public-api';

export default defineConfig({
  component: {
    devServer,
    specPattern: 'apps/eternal/src/**/*.cy.ts'
  },
  e2e: {
    baseUrl: 'http://localhost:4200',
    env: {
      apiUrl: 'https://api.eternal-holidays.net'
    },
    setupNodeEvents(on, config) {}
  }
});
