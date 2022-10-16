- [1. Setup](#1-setup)
- [2. Add a first sanity check test](#2-add-a-first-sanity-check-test)
- [3. Make an implicit Subject Assertion](#3-make-an-implicit-subject-assertion)
- [4. Test via an explicit Subject Assertion](#4-test-via-an-explicit-subject-assertion)
- [5. Count the listed customers](#5-count-the-listed-customers)
- [6. Edit a customer's firstname](#6-edit-a-customers-firstname)
- [7. Add a new customer](#7-add-a-new-customer)
- [8. Request Brochure for Firenze](#8-request-brochure-for-firenze)
- [9. Split up the tests](#9-split-up-the-tests)
- [10. Headless (CI) Mode](#10-headless-ci-mode)
- [11. Webkit](#11-webkit)

# 1. Setup

1. Open the **/apps/eternal-e2e/src** folder and make yourself acquainted with its content.

# 2. Add a first sanity check test

Create a new **/apps/eternal-e2e/src/e2e/e2e.cy.ts** file and add the following first test:

<details>
<summary>Show Solution</summary>
<p>

```typescript
describe('init', () => {
  beforeEach(() => {
    cy.visit('');
  });

  it('should do a sanity check', () => {});
});
```

</p>
</details>

# 3. Make an implicit Subject Assertion

Assert that the side-menu has a link which contains the text Holidays. Use the `data-testid` attribute as selector.

<details>
<summary>Show Solution</summary>
<p>

**./e2e.cy.ts**

```typescript
it('should do an implicit subject assertion', () => {
  cy.get('[data-testid=btn-holidays]').should('have.text', 'Holidays');
});
```

</p>
</details>

# 4. Test via an explicit Subject Assertion

We check again the link for text Holidays. This time, we also check against the class and the link itself.

<details>
<summary>Show Solution</summary>
<p>

**./e2e.cy.ts**

```typescript
it('should do an explicit subject assertion', () => {
  cy.get('[data-testid=btn-holidays]').should(($button) => {
    expect($button).to.have.text('Holidays');
    expect($button).to.have.class('mat-raised-button');
    expect($button).to.have.attr('href', '/holidays');
  });
});
```

</p>
</details>

# 5. Count the listed customers

Go to the customers list and count the rows:

<details>
<summary>Show Solution</summary>
<p>

**./e2e.cy.ts**

```typescript
it('should count the entries', () => {
  cy.get('[data-testid=btn-customers]').click();
  cy.get('div.row:not(.header)').should('have.length', 10);
});
```

</p>
</details>

# 6. Edit a customer's firstname

Rename Latitia to Laetitia via the form

<details>
<summary>Show Solution</summary>
<p>

**./e2e.cy.ts**

```typescript
it('should rename Latitia to Laetitia', () => {
  cy.get('[data-testid=btn-customers]').click();
  cy.get('div').should('contain.text', 'Latitia');
  cy.get('div').contains('Latitia').siblings('.edit').click();
  cy.get('.formly-firstname input').clear().type('Laetitia');
  cy.get('button[type=submit]').click();

  cy.get('div').should('contain.text', 'Laetitia Bellitissa');
});
```

</p>
</details>

# 7. Add a new customer

Add a new customer and check if it appears on the listing page.

<details>
<summary>Show Solution</summary>
<p>

**./e2e.cy.ts**

```typescript
it('should add a new customer', () => {
  cy.get('[data-testid=btn-customers]').click();
  cy.get('[data-testid=btn-customers-add]').click();
  cy.get('input:first').type('Tom');
  cy.get('input:eq(1)').type('Lincoln');
  cy.get('mat-select').click().get('mat-option').contains('USA').click();
  cy.get('input:eq(2)').type('12.10.1995');
  cy.get('button[type=submit]').click();
  cy.get('[data-testid=btn-customers-next]').click();
  cy.get('[data-testid=btn-customers-next]').click();

  cy.get('div').should('contain.text', 'Tom Lincoln');
});
```

</p>
</details>

# 8. Request Brochure for Firenze

Write a test that clicks on the Florence holiday's "Get a Brochure" button and verifies that the input "Domgasse 5" shows "Brochure sent".

<details>
<summary>Show Solution</summary>
<p>

**./e2e.cy.ts**

```typescript
it('should request brochure for Firenze', () => {
  cy.get('[data-testid=btn-holidays]').click();
  cy.get('eternal-holiday-card')
    .contains('Firenze')
    .parents('eternal-holiday-card')
    .find('a')
    .click();
  cy.get('[data-testid=ri-address]').type('Domgasse 5');
  cy.get('[data-testid=ri-search]').click();
  cy.get('[data-testid=ri-message]').should('have.text', 'Brochure sent');
});
```

</p>
</details>

# 9. Split up the tests

Split up the test into 3 different spec files:

- customers.cy.ts
- holidays.cy.ts
- misc.cy.ts

# 10. Headless (CI) Mode

Run the tests via `npm run e2e`. You should see no browser and the output only via the console. All tests should end successfully and there should be a video folder, where you can see the recordings of the run.

Try to fail a test, re-run them again, and you will see that a screenshot has been created for the failed test.

# 11. Webkit

Go to `cypress.config.ts` and temporarily set the parameter `experimentalSessionAndOrigin` to `false`. Now restart Cypress, select Webkit as browser and check if the tests are still working.
Don't forget to set `experimentalSessionAndOrigin` back to `true`.
