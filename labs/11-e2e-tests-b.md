- [Part 1](#part-1)
  - [1.1 Individual Commands](#11-individual-commands)
  - [1.2. Different Resolutions](#12-different-resolutions)
  - [1.3. Page Object Model for Sidemenu](#13-page-object-model-for-sidemenu)
  - [1.4. Customer Form POM](#14-customer-form-pom)
- [Part 2](#part-2)
  - [2.1 Local Scope with POMs](#21-local-scope-with-poms)
  - [2.2 Local Scope with API](#22-local-scope-with-api)
  - [2.3 Local Scope with Test-API](#23-local-scope-with-test-api)
  - [2.4 Global Scope - Intelligent Test](#24-global-scope---intelligent-test)
  - [2.5. Global Scope - Stubbed Test](#25-global-scope---stubbed-test)
- [Part 3](#part-3)
  - [3.1 Component E2E with Storybook](#31-component-e2e-with-storybook)

# Part 1

## 1.1 Individual Commands

Instead of writing `cy.get("[data-test=btn-submit]")`, it should be possible to use `cy.getByAttr("btn-submit")`. This would be an extension to the `cy` object and has already been done in **/cypress/support/commands.ts**. Open it and study the implementation as well as the decalaration for type-safety.

If time allows, you can also apply the `cy.getByAttr` in all your tests.

Based on the existing extension, try to come up with a further command that can replace the snippet

```typescript
cy.get('app-holiday-card').should('contain.text', 'Angkor Wat');
cy.get('app-holiday-card').contains('Angkor Wat').click();
```

to

```typescript
cy.getContains('app-holiday-card', 'Angkor Wat').click();
```

Make sure that the command is also type-safe.

<details>
<summary>Show Solution</summary>
<p>

**/cypress/support/commands.ts**

```typescript
declare namespace Cypress {
  interface Chainable<Subject> {
    // ...

    getContains(selector: string, contains: string): Chainable;
  }
}
```

```typescript
Cypress.Commands.add(
  'getContains',
  (selector: string, contains: string): Chainable => {
    cy.get(selector).should('contain', contains);
    return cy.get(selector).contains(contains);
  }
);
```

</p>
</details>

## 1.2. Different Resolutions

Cypress has pre-defined resolutions which can be run by `cy.viewport("preset")`. Run the _should count the entities_ test with following presets

- ipad-2
- ipad-mini
- iphone-6
- samsung-s10

<details>
<summary>Show Solution</summary>
<p>

**customers.spec.ts**

```typescript
(['ipad-2', 'ipad-mini', 'iphone-6', 'samsung-s10'] as ViewportPreset[]).forEach((preset) => {
  it(`should count the entries in ${preset}`, () => {
    cy.viewport(preset);
    cy.visit('');
    cy.get('[data-test=btn-customers]').click();
    cy.get('div.row:not(.header)').should('have.length', 10);
  });
});
```

</p>
</details>

## 1.3. Page Object Model for Sidemenu

Create a Page Object Model for the sidemenu and use it in all the tests.

Think of ways to maximise type-saftey.

<details>
<summary>Show Solution</summary>
<p>

**../pom/sidemenu.pom.ts**

```typescript
class Sidemenu {
  open(name: 'Customers' | 'Holidays'): Chainable {
    return cy.get('mat-drawer a').contains(name).click();
  }
}

export const sidemenu = new Sidemenu();
```

</p>
</details>

## 1.4. Customer Form POM

The `should add a new customer` should be runnable by following code:

```typescript
it('should add a new customer', () => {
  cy.visit('');
  sidemenu.open('Customers');
  cy.getByAttr('btn-customers-add').click();
  customer.setFirstname('Tom');
  customer.setName('Lincoln');
  customer.setCountry('USA');
  customer.setBirthday(new Date(1995, 9, 12));
  customer.submit();
  cy.getByAttr('btn-customers-next').click();
  cy.getByAttr('btn-customers-next').click();

  cy.get('div').should('contain.text', 'Tom Lincoln');
});
```

Implement the required POM `customer`.

<details>
<summary>Show Solution</summary>
<p>

**../pom/customer.pom.ts**

```typescript
import Chainable = Cypress.Chainable;
import { format } from 'date-fns';

class Customer {
  setFirstname(firstname: string): Chainable {
    return cy.get('.formly-firstname input').clear().type(firstname);
  }

  setName(name: string): Chainable {
    return cy.get('.formly-name input').clear().type(name);
  }

  setCountry(country: string): Chainable {
    return cy.get('mat-select').click().get('mat-option').contains(country).click();
  }

  setBirthday(date: Date): Chainable {
    return cy.get('.formly-birthdate input').clear().type(format(date, 'dd.MM.yyyy'));
  }

  submit(): Chainable {
    return cy.get('button[type=submit]').click();
  }
}

export const customer = new Customer();
```

</p>
</details>

# Part 2

We have discussed the special challenges we have to face in E2E tests with databases. In this part, you will implement patterns that should mitigate the effect of tight-coupled tests.

**Important**: Start cypress with `npm run e2e:watch:non-mock`. That disables the mocked HTTP client for the customer module and sends the requests directly to the public API. If you have a customised environment, make sure its property `mockHttp` is set to `false`.

Add the `skip` command to the existing customer tests:

- should rename Latitia to Laetitia
- should add a new customer

## 2.1 Local Scope with POMs

Open **/cypress/integration/diary.ts**. This test generates a new user at each run. It does that by using POM. This is not what we want. Nevertheless, study the code and especially the POMs. Don't forget to run to test to verify that it turns green.

## 2.2 Local Scope with API

The registration of a new user along login requires three sequential steps. Every step has an individual HTTP endpoint.

1. Fill-In Sign-Up form: `/security/sign-up`
2. Activate account: `/security/activate-user-by-code/{userId/{code}`. The code is always _007_.
3. Sign-In: `/security/sign-in`

The `sign-up` endpoint returns a JSON object that contains a property `userId`. The endpoint is callable via a _POST_ method and awaits a JSON object in the form `{email: string, password: string, firstname: string, name: string}`.

The `sign-in` endpoint awaits a JSON object `{email: string, password: string}`.

---

Write a test that is calling these endpoints directly by using `cy.request`.

The file **/cypress/util/api.ts** should act as "Page Object Model" and provide methods that call the three endpoints.

In case you are running the backend locally, make sure the `apiUrl` is set right in **/apps/eternal-e2e/cypress.json**:

```json
{
  ...
  "env": {
    "apiUrl": "https://api.eternal-holidays.net"
  }
}
```

<details>
<summary>Show Solution</summary>
<p>

**/cypress/util/api.ts**

```typescript
import { BasicData } from '../../../eternal/src/app/security/sign-up/basic/basic.component';
import { DetailData } from '../../../eternal/src/app/security/sign-up/detail/detail.component';
import { InterestsData } from '../../../eternal/src/app/security/sign-up/interests/interests.component';
import { BaseApi } from './base-api';

class Api extends BaseApi {
  signUp(basicData: BasicData, detailData: DetailData, interests: InterestsData) {
    return this.post('security/sign-up', {
      email: detailData.email,
      password: detailData.password,
      firstname: detailData.firstname,
      name: detailData.name
    }).then((response) => response.body as { userId: number });
  }

  signIn(email: string, password: string) {
    return this.post('security/sign-in', {
      email,
      password
    }).then((response) => response.body);
  }

  activate(userId: number, code: string) {
    return this.post(`security/activate-user-by-code/${userId}/${code}`, {});
  }
}

export const api = new Api();
```

**/cypress/integration/diary.spec.ts**

```typescript
import { api } from '../util/api';

// ...

it('should verify sign-up via API calls', () => {
  const data = createSignUpData();
  const { email, password } = data.detail;

  api
    .signUp(data.basic, data.detail, data.interests)
    .then(({ userId }) => api.activate(userId, '007'));
  api.signIn(email, password);

  cy.visit('');
  container.clickDiary();
  diary.verify();
});
```

</p>
</details>

## 2.3 Local Scope with Test-API

There also exists an endpoint which is only available in the test profile. It is `/test/sign-in-and-create-user`. The request should contain the same JSON as the `/security/sign-up` one. The only difference is that this endpoint is also doing the activation and sign-in.

Create another test that is doing the same as the two former ones but this time use the special "Test API".

<details>
<summary>Show Solution</summary>
<p>

**/cypress/util/test-api.ts**

```typescript
import { BaseApi } from './base-api';

class TestApi extends BaseApi {
  signInAndCreateUser(email: string, password: string, firstname: string, name: string) {
    return this.post('test/sign-in-and-create-user', {
      email,
      password,
      firstname,
      name
    }).then((response) => response.body);
  }
}

export const testApi = new TestApi();
```

**/cypress/integration/diary.spec.ts**

```typescript
import { testApi } from '../util/test-api';

// ...

it('should use the Test-API', () => {
  const data = createSignUpData();
  const { email, password, firstname, name } = data.detail;

  testApi.signInAndCreateUser(email, password, firstname, name);
  cy.visit('');
  container.clickDiary();
  diary.verify();
});
```

</p>
</details>

## 2.4 Global Scope - Intelligent Test

Write an intelligent test that adds a news customer. For the assertion part, the test should navigate through the pages until the customer is found. Afterwards, it should remove the customer and verify that it has really gone.

That test should replace the existing "add add a new customer" test.

**Note**: That is very advanced exercise and not for beginners. It is **highly** recommended that you copy the solution and try to understand it.

<details>
<summary>Show Solution</summary>
<p>

Most work happens in the customers pom. You need to add and update the existing methods.

**/cypress/pom/customers.pom.ts**

```typescript
import { formly } from '../util/formly';

export class Customers {
  clickCustomer(customer: string) {
    this.goTo(customer);
    cy.get('div').contains(customer).siblings('.edit').click();
  }

  open() {
    return cy.getByAttr('btn-customers').click();
  }

  add() {
    cy.getByAttr('btn-customers-add').click();
  }

  delete() {
    cy.get('button').contains('Delete').click();
  }

  submitForm(firstname: string, name: string, country: string, birthdate: Date) {
    formly.fillIn(
      {
        firstname,
        name,
        country,
        birthdate
      },
      { select: ['country'], date: ['birthdate'] },
      '.app-customer'
    );
    return cy.get('.app-customer button[type=submit]').click();
  }

  goTo(customer: string) {
    this.verifyCustomer(customer);
  }

  goToEnd() {
    const fn = (hasNextPage: boolean) => {
      if (hasNextPage) {
        this.nextPage().then(fn);
      }
    };
    this.nextPage().then(fn);
  }

  verifyCustomerDoesNotExist(customer: string) {
    const checkOnPage = (hasNextPage: boolean) =>
      cy.get('[data-test=row-customer] p.name').then(($names) => {
        const exists = Cypress._.some($names.toArray(), ($name) => $name.textContent === customer);

        if (exists) {
          throw new Error(`Customer ${customer} does exist`);
        }

        if (hasNextPage) {
          this.nextPage().then(checkOnPage);
        }
      });

    this.nextPage().then(checkOnPage);
  }

  verifyCustomer(customer: string) {
    const checkOnPage = (hasNextPage: boolean) =>
      cy.get('[data-test=row-customer] p.name').then(($names) => {
        const exists = Cypress._.some($names.toArray(), ($name) => $name.textContent === customer);

        if (!exists) {
          if (hasNextPage) {
            this.nextPage().then(checkOnPage);
          } else {
            throw new Error(`Customer ${customer} does not exist`);
          }
        }
      });

    this.nextPage().then(checkOnPage);
  }

  private nextPage() {
    cy.getByAttr('btn-customers-next').as('button');
    cy.get('[data-test=row-customer]:first() p.name').as('firstCustomerName');

    return cy.get('@button').then(($button) => {
      const isDisabled = $button.prop('disabled');
      if (!isDisabled) {
        cy.get('@firstCustomerName').then((firstName) => {
          const name = firstName.text();
          cy.get('@button').click();
          cy.get('@firstCustomerName').should('not.contain', name);
        });
      } else {
        cy.wrap(false);
      }
    });
  }
}

export const customers = new Customers();
```

```typescript
it.only('should create and delete a customer in an intelligent way', () => {
  const name =
    Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const fullName = `Max ${name}`;

  cy.visit('');
  customers.open();
  customers.add();
  customers.submitForm('Max', name, 'Austria', new Date(1985, 11, 12));
  customers.clickCustomer(fullName);
  customers.delete();
  customers.verifyCustomerDoesNotExist(fullName);
});
```

</p>
</details>

## 2.5. Global Scope - Stubbed Test

Write a test where you mock the endpoint for holidays and replace it with the contents of the `holidays.json` file in the fixtures folder.

<details>
<summary>Show Solution</summary>
<p>

```typescript
it('should stub the holidays', () => {
  cy.intercept('GET', '**/holiday', { fixture: 'holidays.json' });
  cy.visit('');
  cy.getByAttr('btn-holidays').click();
  cy.get('app-holiday-card').should('contain.text', 'Unicorn');
});
```

</p>
</details>

# Part 3

## 3.1 Component E2E with Storybook

Let's combine Cypress and Storybook to E2E-test components in isolation.

Create a new file in **./storybook.spec.ts**:

```typescript
describe('Component Tests', () => {
  it('should mock', () => {
    cy.intercept('https://nominatim.openstreetmap.org/**', {
      body: []
    });

    cy.visit('http://localhost:4400/iframe.html?id=eternal-requestinfo');
    cy.getByAttr('address').type('Domgasse 5');
    cy.getByAttr('btn-search').click();
    cy.getByAttr('lookup-result').should('contain', 'Address not found');
  });

  it('Domgasse 5 succeeds', () => {
    cy.visit('http://localhost:4400/iframe.html?id=eternal-requestinfo');
    cy.getByAttr('address').type('Domgasse 5');
    cy.getByAttr('btn-search').click();
    cy.contains('Brochure sent');
  });

  it('Domgasse does not succeed', () => {
    cy.visit('http://localhost:4400/iframe.html?id=eternal-requestinfo');
    cy.getByAttr('address').type('Domgasse');
    cy.getByAttr('btn-search').click();
    cy.contains('Brochure sent');
  });
});
```

You will find out that the last test fails. Did we miss something? 🤔

There is no solution for this task. If time is short, see it as your homework. Good luck! 👍
