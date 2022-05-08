- [1. Individual Commands](#1-individual-commands)
- [2. Intercept Network Requests](#2-intercept-network-requests)
- [3. Page Object Model: Customer Form & Sidemenu](#3-page-object-model-customer-form--sidemenu)
- [4. Angular Harness in Cypress](#4-angular-harness-in-cypress)
- [6. Direct Backend communication with `cy.request`](#6-direct-backend-communication-with-cyrequest)
  - [6.1 Local Scope with POMs](#61-local-scope-with-poms)
  - [6.2 Local Scope with API](#62-local-scope-with-api)
  - [Bonus: 6.3 Local Scope with Test-API](#bonus-63-local-scope-with-test-api)
  - [Bonus: 6.4 Global Scope - Intelligent Test](#bonus-64-global-scope---intelligent-test)
- [Bonus: 7. Different Resolutions](#bonus-7-different-resolutions)

**The project's path is: /apps/eternal-e2e/src/**

# 1. Individual Commands

Instead of writing `cy.get("[data-testid=btn-submit]")`, it should be possible to use `cy.getByAttr("btn-submit")`. This would be an extension to the `cy` object and has already been done in **./support/commands.ts**. Open it and study the implementation as well as the decalaration for type-safety.

If time allows, you can also apply the `cy.getByAttr` in all your tests.

Based on the existing extension, try to come up with a further command that replaces the snippet

```typescript
cy.get('app-holiday-card').should('contain.text', 'Angkor Wat').contains('Angkor Wat').click();
```

to

```typescript
cy.getContains('app-holiday-card', 'Angkor Wat').click();
```

Make sure that the command is also type-safe.

<details>
<summary>Show Solution</summary>
<p>

**./support/commands.ts**

```typescript
declare namespace Cypress {
  interface Chainable<Subject> {
    // ...

    getContains(selector: string, contains: string): Chainable;
  }
}
```

```typescript
Cypress.Commands.add('getContains', (selector: string, contains: string): Chainable => {
  cy.get(selector).should('contain', contains);
  return cy.get(selector).contains(contains);
});
```

</p>
</details>

# 2. Intercept Network Requests

Write a test where you mock the endpoint for holidays and replace it with the contents of the **holidays.json** file in the **fixtures** folder.

<details>
<summary>Show Solution</summary>
<p>

**integration/holidays.spec.ts**

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

# 3. Page Object Model: Customer Form & Sidemenu

The `should add a new customer` should be runnable by following code:

```typescript
it('should add a new customer', () => {
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

Implement the required POM `customer` and `sidemenu`.

<details>
<summary>Show Solution</summary>
<p>

**./pom/sidemenu.pom.ts**

```typescript
class Sidemenu {
  open(name: 'Customers' | 'Holidays') {
    return cy.get('mat-drawer a').contains(name).click();
  }
}

export const sidemenu = new Sidemenu();
```

**./pom/customer.pom.ts**

```typescript
import { format } from 'date-fns';

class Customer {
  setFirstname(firstname: string) {
    return cy.get('.formly-firstname input').clear().type(firstname);
  }

  setName(name: string) {
    return cy.get('.formly-name input').clear().type(name);
  }

  setCountry(country: string) {
    return cy.get('mat-select').click().get('mat-option').contains(country).click();
  }

  setBirthday(date: Date) {
    return cy.get('.formly-birthdate input').clear().type(format(date, 'dd.MM.yyyy'));
  }

  submit() {
    return cy.get('button[type=submit]').click();
  }
}

export const customer = new Customer();
```

</p>
</details>

# 4. Angular Harness in Cypress

1. Create a Harness for the `customer.component.ts` in Angular. It should provide the same actions that he POM has.

2. Append following line to **./support/index.ts**:

```typescript
import '@jscutlery/cypress-harness/support';
```

3. Inside your e2e test, you can get the harness via

```typescript
const harness = getHarness(CustomerComponentHarness);
```

<details>
<summary>Show Solution</summary>
<p>

**/apps/eternal/src/app/customer/customer/customer.component.harness.ts**

```typescript
import { ComponentHarness } from '@angular/cdk/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatDatepickerInputHarness } from '@angular/material/datepicker/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatSelectHarness } from '@angular/material/select/testing';

export class CustomerComponentHarness extends ComponentHarness {
  static hostSelector = 'eternal-customer';

  protected getFirstnameInput = this.locatorFor(
    MatInputHarness.with({ selector: '.formly-firstname input' })
  );
  protected getNameInput = this.locatorFor(
    MatInputHarness.with({ selector: '.formly-name input' })
  );
  protected getCountry = this.locatorFor(MatSelectHarness);
  protected getBirthday = this.locatorFor(MatDatepickerInputHarness);
  protected getButton = this.locatorFor(MatButtonHarness.with({ selector: '[type=submit]' }));

  async setFirstname(firstname: string) {
    const input = await this.getFirstnameInput();
    return input.setValue(firstname);
  }

  async setName(name: string) {
    const input = await this.getNameInput();
    return input.setValue(name);
  }

  async setCountry(name: string) {
    const select = await this.getCountry();
    await select.open();
    const [option] = await select.getOptions({ text: name });
    return option.click();
  }

  async setBirthday(birthday: Date) {
    const input = await this.getBirthday();
    return input.setValue(
      birthday.getMonth() + 1 + '/' + birthday.getDay() + '/' + birthday.getFullYear()
    );
  }

  async save() {
    const button = await this.getButton();
    return button.click();
  }
}
```

**integration/customers.spec.ts**

```typescript
it('should add a new customer', () => {
  sidemenu.open('Customers');
  cy.getByAttr('btn-customers-add').click();
  const harness = getHarness(CustomerComponentHarness);
  harness.setFirstname('Tom');
  harness.setName('Lincoln');
  harness.setCountry('USA');
  harness.setBirthday(new Date(1995, 9, 12));
  harness.save();
  cy.getByAttr('btn-customers-next').click();
  cy.getByAttr('btn-customers-next').click();

  cy.get('div').should('contain.text', 'Tom Lincoln');
});
```

</p>
</details>

# 6. Direct Backend communication with `cy.request`

We have discussed the special challenges we have to face in E2E tests with databases. In this exercise, you will implement patterns that should mitigate the effect of tightly-coupled tests.

**Important**: Start cypress with `npm run e2e:non-mock`. That disables the mocked HTTP client for the customer module and sends the requests directly to the public API. If you have a customised environment, make sure its property `mockHttp` is set to `false`.

Add the `skip` command to the existing customer tests:

- should rename Latitia to Laetitia
- should add a new customer

## 6.1 Local Scope with POMs

Open **./integration/diary.ts**. This test generates a new user at each run. It does that by using POM. This is not what we want. Nevertheless, study the code and especially the POMs. Don't forget to run to test to verify that it turns green.

## 6.2 Local Scope with API

The registration of a new user along login requires three sequential steps. Every step has an individual HTTP endpoint.

1. Fill-In Sign-Up form: `/security/sign-up`
2. Activate account: `/security/activate-user-by-code/{userId/{code}`. The code is always _007_.
3. Sign-In: `/security/sign-in`

The `sign-up` endpoint returns a JSON object that contains a property `userId`. The endpoint is callable via a _POST_ method and awaits a JSON object in the form `{email: string, password: string, firstname: string, name: string}`.

The `sign-in` endpoint awaits a JSON object `{email: string, password: string}`.

---

Write a test that is calling these endpoints directly by using `cy.request`.

The file **./util/api.ts** should act as "Page Object Model" and provide methods that call the three endpoints.

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

**./util/api.ts**

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

**./integration/diary.spec.ts**

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

## Bonus: 6.3 Local Scope with Test-API

There also exists an endpoint which is only available in the test profile. It is `/test/sign-in-and-create-user`. The request should contain the same JSON as the `/security/sign-up` one. The only difference is that this endpoint is also doing the activation and sign-in.

Create another test that is doing the same as the two former ones but this time use the special "Test API".

<details>
<summary>Show Solution</summary>
<p>

**./util/test-api.ts**

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

**./integration/diary.spec.ts**

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

## Bonus: 6.4 Global Scope - Intelligent Test

Write an intelligent test that adds a news customer. For the assertion part, the test should navigate through the pages until the customer is found. Afterwards, it should remove the customer and verify that it has really gone.

That test should replace the existing "add a new customer" test.

**Note**: That is very advanced exercise and not for beginners. It is **highly** recommended that you copy the solution and try to understand it.

<details>
<summary>Show Solution</summary>
<p>

Most work happens in the customers pom. You need to add and update the existing methods.

**./pom/customers.pom.ts**

```typescript
import { formly } from '../util/formly';
import Chainable = Cypress.Chainable;

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
    const fn: any = (hasNextPage: boolean) => {
      if (hasNextPage) {
        this.nextPage().then(fn);
      }
    };
    this.nextPage().then(fn);
  }

  verifyCustomerDoesNotExist(customer: string) {
    const checkOnPage = (hasNextPage: boolean) => {
      return cy.get('[data-testid=row-customer] p.name').then(($names) => {
        const exists = Cypress._.some($names.toArray(), ($name) => $name.textContent === customer);

        if (exists) {
          throw new Error(`Customer ${customer} does exist`);
        }

        if (hasNextPage) {
          this.nextPage().then(checkOnPage);
        }
      });
    };

    this.nextPage().then(checkOnPage);
  }

  verifyCustomer(customer: string) {
    const checkOnPage = (hasNextPage: boolean) =>
      cy.get('[data-testid=row-customer] p.name').then(($names) => {
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

  private nextPage(): Chainable<boolean> {
    cy.getByAttr('btn-customers-next').as('button');
    cy.get('[data-testid=row-customer]:first() p.name').as('firstCustomerName');

    return cy.get('@button').then(($button) => {
      const isDisabled = $button.prop('disabled');
      if (!isDisabled) {
        return cy.get('@firstCustomerName').then((firstName) => {
          const name = firstName.text();
          cy.get('@button').click();
          cy.get('@firstCustomerName').should('not.contain', name);
          return cy.wrap(true);
        });
      } else {
        return cy.wrap(false);
      }
    });
  }
}

export const customers = new Customers();
```

```typescript
it('should create and delete a customer in an intelligent way', () => {
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

# Bonus: 7. Different Resolutions

Cypress has pre-defined resolutions which can be run by `cy.viewport("preset")`. Run the _should count the entities_ test with following presets

- ipad-2
- ipad-mini
- iphone-6
- samsung-s10

<details>
<summary>Show Solution</summary>
<p>

**./integration/customers.spec.ts**

```typescript
(['ipad-2', 'ipad-mini', 'iphone-6', 'samsung-s10'] as ViewportPreset[]).forEach((preset) => {
  it(`should count the entries in ${preset}`, () => {
    cy.viewport(preset);
    cy.visit('');
    cy.get('[data-testid=btn-customers]').click();
    cy.get('div.row:not(.header)').should('have.length', 10);
  });
});
```

</p>
</details>
