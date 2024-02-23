import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    experimentalWebKitSupport: true,
    setupNodeEvents(on, config) {
      on('task', {
        log(message: string) {
          console.log(`${new Date().toISOString()} - ${message}`)
          return 'passt';
        }
      })
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
