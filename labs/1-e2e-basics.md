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
- [12. Bonus: Accessibility](#12-bonus-accessibility)

To solve the exercises in this lab, consult the slides and the [official documentation](https://docs.cypress.io/guides/end-to-end-testing/writing-your-first-end-to-end-test).

Try to use always the `data-testid` in your selections.

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

Write a test that does multiple assertions against the holidays link in the sidemenu:

1. It should have the text "Holidays".
2. It should have the CSS class "mat-mdc-raised-button".
3. It should have an attribute "href" with value "/holidays".
4. Its text should have the colour "rgb(0, 0, 0)".

Use an explicit assertion (callback parameter in the `should` method).

<details>
<summary>Show Solution</summary>
<p>

**./e2e.cy.ts**

```typescript
it('should do an explicit subject assertion', () => {
  cy.get('[data-testid=btn-holidays]').should(($button) => {
    expect($button).to.have.text('Holidays');
    expect($button).to.have.class('mat-mdc-raised-button');
    expect($button).to.have.attr('href', '/holidays');
    expect($button).to.have.css('color', 'rgb(0, 0, 0)');
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
  cy.get('[data-testid=row-customer]').should('have.length', 10);
});
```

</p>
</details>

# 6. Edit a customer's firstname

Rename Latitia to Laetitia via the form. Make sure to start typing into the firstname's input field, once its value has been set.

<details>
<summary>Show Solution</summary>
<p>

**./e2e.cy.ts**

```typescript
it('should rename Latitia to Laetitia', () => {
  cy.get('[data-testid=btn-customers]').click();
  cy.contains('[data-testid=row-customer]', 'Latitia').find('[data-testid=btn-edit]').click();
  cy.get('[data-testid=inp-firstname]').should('have.value', 'Latitia').clear().type('Laetitia');
  cy.get('[data-testid=btn-submit]').click();

  cy.get('[data-testid=row-customer]').should('contain.text', 'Laetitia Bellitissa');
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
  cy.get('[data-testid=inp-firstname]').type('Tom');
  cy.get('[data-testid=inp-name]').type('Lincoln');
  cy.get('[data-testid=sel-country]').click();
  cy.get('[data-testid=opt-country]').contains('USA').click();
  cy.get('[data-testid=inp-birthdate]').type('12.10.1995');
  cy.get('[data-testid=btn-submit]').click();
  cy.get('[data-testid=btn-customers-next]').click();

  cy.get('[data-testid=row-customer]').should('contain.text', 'Tom Lincoln');
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
  cy.contains('[data-testid=holiday-card]', 'Firenze').find('[data-testid=btn-brochure]').click();
  cy.get('[data-testid=ri-address]').type('Domgasse 5');
  cy.get('[data-testid=ri-search]').click();
  cy.get('[data-testid=ri-message]').should('contain.text', 'Brochure sent');
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

# 12. Bonus: Accessibility

Write the tests

- **should request brochure for Firenze** and
- **should rename Latitia to Laetitia**

by using the testing library bindings for Cypress.

You should be able to write them by using accessibility selectors only. No `data-testid` is necessary.

If you are short on time, you can stop now. Your trainer will discuss the solution with you.

<details>
<summary>Show Solution</summary>
<p>

**./testing-library.cy.ts**

```typescript
describe('E2E via Testing Library', () => {
  beforeEach('', () => {
    cy.visit('?use-testid=0');
  });

  it('should request brochure for Firenze', () => {
    cy.findByRole('link', { name: 'Holidays' }).click();

    cy.findByLabelText(/Firenze/i)
      .findByRole('link', { name: 'Get a Brochure' })
      .click();
    cy.findByLabelText('Address').type('Domgasse 5');
    cy.findByRole('button', { name: 'Send' }).click();
    cy.findByRole('status', 'Brochure sent');
  });

  it('should rename Latitia to Laetitia', () => {
    cy.findByRole('link', { name: 'Customers' }).click();
    cy.findByLabelText(/Latitia/)
      .findByRole('link', { name: 'Edit Customer' })
      .click();
    cy.findByLabelText('Firstname').should('have.value', 'Latitia').clear().type('Laetitia');
    cy.findByRole('button', { name: 'Save' }).click();

    cy.findAllByRole('link', { name: 'Edit Customer' }).should('have.length', 10);
    cy.findByLabelText(/Latitia/).should('not.exist');
  });
});
```

</p>
</details>
