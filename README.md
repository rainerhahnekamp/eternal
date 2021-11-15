# Angular Workshop Testing

After cloning the project, run `yarn` for downloading the dependencies. Verify
that the applications starts with `npm run start`.

`https://api.eternal-holidays.net` acts as the default backend.

---

If the backend is not reachable you can also run the backend locally (see below)
.

### System Check

To verify everything is working, you can run following commands:

- Unit Tests: `npm run test`
  Tests with Puppeteer: `npm run test:vr`
- Storybook: `npm run storybook` (Storybook should start
  on http://localhost:4400)
- Cypress: `npm run e2e:watch`
- optional: Backend (see notes below): `mvnw spring-boot:run -pl backend`

### Local Backend

You can run the backend also locally. It is written in Spring Boot and uses H2
as database. The db file is located in `backend/db.mv.db`.

Execute `./mvnw spring-boot:run -pl backend`. You require at least Java 1.8.

You also have to replace the `baseUrl` property in `environment.ts` or just
run `npm run start:dev-local`.

### Full Rewrite from Scratch

If you have the desire to fully rebuild the system from scratch with an Angular
application build from scratch, following commands should be executed:

```bash
npx ng add @angular/material

# NgRx
pnpm add @ngrx/store @ngrx/effects @ngrx/store-devtools

# Forms
pnpm add @ngx-formly/core @ngx-formly/material ngx-formly-helpers

# Utility libs
pnpm add lodash-es date-fns

# Tailwind
pnpm add -D tailwindcss postcss

# Auto-Spies
pnpm add -D jest-auto-spies

# RxJs Marbles
pnpm add -D rxjs-marbles

# Testing Boilerplate
pnpm add -D @ngneat/spectator ng-mocks ngx-build-plus @types/lodash-es @testing-library/angular

# Component Harnesses in Cypress
pnpm add -D @jscutlery/cypress-harness cypress-pipe

# Visual Regression - Puppeteer
pnpm add -D jest-image-snapshot jest-puppeteer puppeteer @types/expect-puppeteer @types/jest-environment-puppeteer @types/jest-image-snapshot @types/puppeteer

# Enable Storybook
npx ng g @nrwl/angular:storybook-configuration eternal

# Visual Regression - Cypress
pnpm add -D cypress-plugin-snapshots

# Playwright
pnpm add -D @playwright/test
```
