# Angular Workshop Testing

Fork the Projekt

## DATEV-VDI

### Starting

After cloning the project and executing the file "environment.bat" in the IntelliJ Terminal, use:

```
 npm install
 cypress open
```
for downloading the dependencies, you can
start the Angular application via `npm run start:dev-local`.
if there are problems concerning certificates then be sure that %appdata%\npm/etc/cacert.txt contains all needed certificates and that CYPRESS_DOWNLOAD_USE_CA is not misspelled .  

---

### Local Backend

You can run the backend also locally. It is written in Spring Boot and uses H2
as database. The db file is located in `backend/db.mv.db`.

In IntelliJ you can open the backend folder as a new project or right-click on the pom.xml file in the backend directory, and select 'Add as maven project' if
it can't start via Run configuration "EternalApplication".

---

### System Check

To verify everything is working, you can run following commands:

- Unit Tests: `npm run test`
  Tests with Puppeteer: `npm run test:vr` (--> Puppeteer doesnt work at Datev right now, because the currently supported chrome version of puppeteer is 93 and the installed chrome is version 95)
- Storybook: `npm run storybook`
- Playwright: `npm run test:playwright`
- Cypress: `npm run e2e`

### E2E Tests in den Übungen

Please start the E2E Tests for the Lab section with: e2e:dev-local.

