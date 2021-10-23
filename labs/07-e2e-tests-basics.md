- [1. Setup](#1-setup)
- [2. Add a first sanity check test](#2-add-a-first-sanity-check-test)
- [3. Make an implicit Subject Assertion](#3-make-an-implicit-subject-assertion)
- [4. Test via an explicit Subject Assertion](#4-test-via-an-explicit-subject-assertion)
- [5. Count the listed customers](#5-count-the-listed-customers)
- [6. Edit a customer's firstname](#6-edit-a-customers-firstname)
- [7. Add a new customer](#7-add-a-new-customer)
- [8. Request Brochure for Firenze](#8-request-brochure-for-firenze)
- [9. Split up tests](#9-split-up-tests)

# 1. Setup

1. Open the **/apps/eternal-e2e/src** folder and make yourself acquainted with its content.

2. Open the **../cypress.json** and check if it contains the value for `baseUrl` and `apiUrl`. Note that the `apiUrl` is part of the `env` property.

# 2. Add a first sanity check test

Create a new **/apps/eternal-e2e/src/integration/e2e.spec.ts** file and add the following first test:

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

Assert that the side-menu has a link which contains the text Holidays. Use the `data-test` attribute as selector.

<details>
<summary>Show Solution</summary>
<p>

**./e2e.spec.ts**

```typescript
it('should do an implicit subject assertion', () => {
  cy.get('[data-test=btn-holidays]').should('have.text', 'Holidays');
});
```

</p>
</details>

# 4. Test via an explicit Subject Assertion

We check again the link for text Holidays. This time, we also check against the class and the link itself.

<details>
<summary>Show Solution</summary>
<p>

**./e2e.spec.ts**

```typescript
it('should do an explicit subject assertion', () => {
  cy.get('[data-test=btn-holidays]').should(($button) => {
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

**./e2e.spec.ts**

```typescript
it('should count the entries', () => {
  cy.get('[data-test=btn-customers]').click();
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

**./e2e.spec.ts**

```typescript
it('should rename Latitia to Laetitia', () => {
  cy.get('[data-test=btn-customers]').click();
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

**./e2e.spec.ts**

```typescript
it('should add a new customer', () => {
  cy.get('[data-test=btn-customers]').click();
  cy.get('[data-test=btn-customers-add]').click();
  cy.get('input:first').type('Tom');
  cy.get('input:eq(1)').type('Lincoln');
  cy.get('mat-select').click().get('mat-option').contains('USA').click();
  cy.get('input:eq(2)').type('12.10.1995');
  cy.get('button[type=submit]').click();
  cy.get('[data-test=btn-customers-next]').click();
  cy.get('[data-test=btn-customers-next]').click();

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

**./e2e.spec.ts**

```typescript
it('should request brochure for Firenze', () => {
  cy.get('[data-test=btn-holidays]').click();
  cy.get('app-holiday-card').contains('Firenze').parents('app-holiday-card').find('a').click();
  cy.get('[data-test=address').type('Domgasse 5');
  cy.get('[data-test=btn-search]').click();
  cy.get('[data-test=lookup-result]').contains('Brochure sent');
});
```

</p>
</details>

# 9. Split up tests

Split up the test into 3 different spec files:

- customers.spec.ts
- holidays.spec.ts
- misc.spec.ts
