- [1. Different Resolutions](#1-different-resolutions)
- [2. Individual Commands](#2-individual-commands)
- [3. Intercept Network Requests](#3-intercept-network-requests)
- [4. Page Object Model: Customer Form \& Sidemenu](#4-page-object-model-customer-form--sidemenu)
- [5. Session Cache \& Domain Switching](#5-session-cache--domain-switching)
  - [5.1. `cy.origin`](#51-cyorigin)
  - [5.2. `cy.session`](#52-cysession)
  - [5.3. Validating the Cache](#53-validating-the-cache)
  - [5.4. Configurable Credentials](#54-configurable-credentials)
- [6. Bonus - Scraping with `cy.task`](#6-bonus---scraping-with-cytask)
- [7. Bonus - Intelligent (Conditional) Test](#7-bonus---intelligent-conditional-test)

**The project's path is: /apps/eternal-e2e/src/**

# 1. Different Resolutions

Cypress has pre-defined resolutions which can be run by `cy.viewport("preset")`. Run the _should count the entities_ test with following presets

- ipad-2
- ipad-mini
- iphone-6
- samsung-s10

<details>
<summary>Show Solution</summary>
<p>

**./e2e/customers.cy.ts**

```typescript
(['ipad-2', 'ipad-mini', 'iphone-6', 'samsung-s10'] as ViewportPreset[]).forEach((preset) => {
  it(`should count the entries in ${preset}`, () => {
    cy.viewport(preset);
    cy.visit('');
    cy.testid('btn-customers').click();
    cy.testid('row-customer').should('have.length', 10);
  });
});
```

</p>
</details>

# 2. Individual Commands

Instead of writing `cy.get("[data-testid=btn-submit]")`, it should be possible to use `cy.testid("btn-submit")`. This would be an extension to the `cy` object and has already been done in **./support/commands.ts**. Open it and study the implementation as well as the declaration for type-safety.

If time allows, you can also apply the `cy.testid` in all your tests.

Based on the existing extension, try to come up with a further command that replaces the snippet

```typescript
cy.get('eternal-holiday-card').should('contain.text', 'Angkor Wat').contains('Angkor Wat').click();
```

to

```typescript
cy.getContains('eternal-holiday-card', 'Angkor Wat').click();
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
Cypress.Commands.add('getContains', (selector: string, contains: string) => {
  cy.get(selector).should('contain', contains);
  return cy.get(selector).contains(contains);
});
```

</p>
</details>

# 3. Intercept Network Requests

Write a test where you mock the endpoint for holidays and replace it with the contents of the **holidays.json** file in the **fixtures** folder.

<details>
<summary>Show Solution</summary>
<p>

**e2e/holidays.cy.ts**

```typescript
it('should mock the holidays', () => {
  cy.intercept('GET', '**/holiday', { fixture: 'holidays.json' });
  cy.visit('');
  cy.testid('btn-holidays').click();
  cy.get('eternal-holiday-card').should('contain.text', 'Unicorn');
});
```

</p>
</details>

# 4. Page Object Model: Customer Form & Sidemenu

The `should add a new customer` should be runnable by following code:

```typescript
it('should add a new customer', () => {
  sidemenu.open('Customers');
  cy.testid('btn-customers-add').click();
  customer.setFirstname('Tom');
  customer.setName('Lincoln');
  customer.setCountry('USA');
  customer.setBirthday(new Date(1995, 9, 12));
  customer.submit();
  cy.testid('btn-customers-next').click();

  cy.testid('row-customer').should('contain.text', 'Tom Lincoln');
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
    cy.testid(`btn-${name.toLowerCase()}`).click();
  }
}

export const sidemenu = new Sidemenu();
```

**./pom/customer.pom.ts**

```typescript
import { format } from 'date-fns';

class Customer {
  setFirstname(firstname: string) {
    cy.testid('inp-firstname').clear().type(firstname);
  }

  setName(name: string) {
    cy.testid('inp-name').clear().type(name);
  }

  setCountry(country: string) {
    cy.testid('sel-country').click();
    cy.testid('opt-country').contains(country).click();
  }

  setBirthday(date: Date) {
    cy.testid('inp-birthdate').clear().type(format(date, 'dd.MM.yyyy'));
  }

  submit() {
    cy.testid('btn-submit').click();
  }
}

export const customer = new Customer();
```

</p>
</details>

# 5. Session Cache & Domain Switching

It is quite usual to use a signed-in user for the majority of the tests.

Our application uses Auth0 as authentication provides. In a first step, we'll do a login where we switch directly to Auth0 and enter the credentials there.

In a further step, we will cache the session data by using `cy.session`.

Third, we'll pack the session cache along the login into an own command.

Create a new file **session.cy.ts**.

## 5.1. `cy.origin`

Let's start with a simple login on a different domain. We have to use `cy.origin` in all places, where we leave our origin domain which is specified in the **cypress.config.ts**.

**./e2e/session.cy.ts**

```typescript
describe('Session', () => {
  it('should login', () => {
    cy.visit('');
    cy.testid('btn-sign-in').click();
    cy.origin('dev-xbu2-fid.eu.auth0.com/', () => {
      cy.get('.auth0-lock-input-email').type('john.list@host.com');
      cy.get('.auth0-lock-input-show-password').type('John List');
      cy.get('.auth0-lock-submit').click();
    });
    cy.testid('p-username').should('have.text', 'Welcome John List');
  });
});
```

## 5.2. `cy.session`

Let's wrap the whole login procedure into a `cy.session` so that it gets cached internally:

**./e2e/session.cy.ts**

```typescript
it('should login', () => {
  cy.session('john-list', () => {
    cy.visit('');

    // rest of the test
  });
});
```

1. Run the test once. Make sure it succeeds and note the execution time.
2. Now rerun. It should be much shorter (well below 1 second).
3. Click on "Clear All Sessions", and rerun the test. You should see that it is not using the cache.

## 5.3. Validating the Cache

Create a new Cypress command, `cy.login` that takes a username and password as parameter. Move the code for the session into it. Make sure the parameters for username and password are used as cache key (first parameter of `cy.session`).

**Note**: If you want to reuse variables inside a `cy.origin`, you have to pass them in an object literal `{args: any}` as second paramter of `cy.origin`. The actual function gets them as first parameter.

Add a test that doesn't use the session. Assert that the second test has not a signed in user.

<details>
<summary>Show Solution</summary>
<p>

**./support/commands.ts**

```typescript
// command declaration...

// other commands...

Cypress.Commands.add('login', (username: string, password: string) => {
  cy.session({ username, password }, () => {
    cy.visit('');
    cy.testid('btn-sign-in').click();
    cy.origin(
      'dev-xbu2-fid.eu.auth0.com/',
      { args: { username, password } },
      ({ username, password }) => {
        cy.get('.auth0-lock-input-email').type(username);
        cy.get('.auth0-lock-input-show-password').type(password);
        cy.get('.auth0-lock-submit').click();
      }
    );
    cy.testid('p-username').should('have.text', 'Welcome John List');
  });
});
```

**./e2e/session.cy.ts**

```typescript
describe('Session', () => {
  it('should reuse the session', () => {
    cy.login('john.list@host.com', 'John List');
    cy.visit('');
    cy.testid('p-username').should('have.text', 'Welcome John List');
  });

  it('should not reuse the session', () => {
    cy.visit('');
    cy.testid('p-username').should('not.exist');
  });
});
```

</p>
</details>

## 5.4. Configurable Credentials

In `cypress.config.ts`, add two variables to store the credentials:

**../cypress.config.ts**

```typescript
import { defineConfig } from 'cypress';
import { nxE2EPreset } from '@nrwl/cypress/plugins/cypress-preset';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__dirname),
    experimentalWebKitSupport: true,
    env: {
      loginUsername: 'john.list@host.com',
      loginPassword: 'John List'
    }
  }
});
```

Update `cy.login`, so that it is callable without parameters and uses the one from the environment as default values. You get access to these variables via `Cypress.env('[variableName]').

<details>
<summary>Show Solution</summary>
<p>

**./support/commands.ts**

```typescript
Cypress.Commands.add('login', (username?: string, password?: string) => {
  if (username === undefined) {
    username = Cypress.env('loginUsername');
  }
  if (password === undefined) {
    password = Cypress.env('loginPassword');
  }

  cy.session({ username, password }, () => {
    cy.visit('');
    cy.testid('btn-sign-in').click();
    cy.origin(
      'dev-xbu2-fid.eu.auth0.com/',
      { args: { username, password } },
      ({ username, password }) => {
        cy.get('.auth0-lock-input-email').type(username);
        cy.get('.auth0-lock-input-show-password').type(password);
        cy.get('.auth0-lock-submit').click();
      }
    );
    cy.testid('p-username').should('have.text', 'Welcome John List');
  });
});
```

</p>
</details>

# 6. Bonus - Scraping with `cy.task`

Write a test that reads all names of the customer's first page and stores them to a file called **customers.txt**.

Please look up the solution in the branch `solution-2-e2e-advanced`.

# 7. Bonus - Intelligent (Conditional) Test

Write an intelligent test that adds a news customer. For the assertion part, the test should navigate through the pages until the customer is found. Afterwards, it should remove the customer and verify that it has really gone.

That test should replace the existing "add a new customer" test.

**Note**: That is very advanced exercise and not for beginners. It is **highly** recommended that you copy the solution and try to understand it.

Checkout the solution from the branch **solution-2-e2e-advanced**.
