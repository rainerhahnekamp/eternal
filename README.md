# Angular Workshop Testing

After cloning the project and `yarn` for downloading the dependencies, you can
start the Angular application via `npm run start`.

`https://api.eternal-holidays.net` acts as the default backend.

---

If the backend is not reachable you also run the backend locally (see below).

### System Check

To verify everything is working, you can run following commands:

- Unit Tests: `npm run test`
  Tests with Puppeteer: `npm run test:vr`
- Storybook: `npm run storybook`
- Cypress: `npm run e2e`
- optional: Backend (see notes below): `mvnw spring-boot:run -pl backend`

### Local Backend

You can run the backend also locally. It is written in Spring Boot and uses H2
as database. The db file is located in `backend/db.mv.db`.

Execute `./mvnw spring-boot:run -pl backend`. You require at least Java 1.8.

You also have to replace the `baseUrl` property in `environment.ts` or just
run `npm run start:dev-local`.
