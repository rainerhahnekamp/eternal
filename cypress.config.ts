import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    experimentalWebKitSupport: true,
    setupNodeEvents(on, config) {
      on('task', {
        log(message: string) {
          console.log(`${new Date().toISOString()} - ${message}`);
          return new Date();
        },
      });
    },
    env: {
      username: 'john.list',
      password: 'John List',
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
