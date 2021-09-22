# Angular Workshop Testing

## DATEV-VDI

First unzip `\\bk.datev.de\dfs\COO\CCD\QM\Public\AngularWorkshop\cypress.zip` into `%localAppdata%\Cypress\Cache\7.7.0`.

## Starting

After cloning the project and using
```
 set PUPPETEER_EXECUTABLE_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe
 set PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
 npm install
```
for downloading the dependencies, you can
start the Angular application via `npm run start:dev-local`.

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
  Tests with Puppeteer: `npm run test:vr`
- Storybook: `npm run storybook`
- Cypress: `npm run e2e`

### E2E Tests in den Übungen

Please start the E2E Tests for the Lab section with: e2e:dev-local
On BK2.0 VDIs please use the Browser Elektron, the browsers Firefox and Chrome are currently not working on BK2.0 VDIs. (We currently fixing this)
