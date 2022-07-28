# Cypress Angular Dev Server
This package is used as the dev server for [cypress-angular-component-testing](https://www.npmjs.com/package/cypress-angular-component-testing):


## Getting Started

To install the package you need to first install it using:

```bash
npm install cypress-angular-dev-server
```

```typescript
// cypress.config.ts

import { defineConfig } from 'cypress';
import { devServer } from 'cypress-angular-dev-server' // the local path is ./projects/angular-dev-server/src/public_api

export default defineConfig({
    component: {
        devServer,
        ...
    },
    ...
})
```