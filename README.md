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
  on http://localhost:6000)
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
npx ng add  @angular/material

yarn add @ngrx/store @ngrx/effects @ngrx/store-devtools @ngx-formly/core @ngx-formly/material ngx-formly-helpers lodash-es

yarn add -D date-fns @ngneat/spectator ng-mocks jest-image-snapshot jest-puppeteer ngx-build-plus rxjs-marbles puppeteer

yarn add -D tailwindcss postcss

yarn add -D @types/lodash-es @types/expect-puppeteer @types/jest-environment-puppeteer @types/jest-image-snapshot @types/puppeteer @jscutlery/cypress-harness cypress-pipe cypress-plugin-snapshots

npx ng g @nrwl/angular:storybook-configuration eternal
```
