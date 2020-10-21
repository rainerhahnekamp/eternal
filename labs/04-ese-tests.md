# Angular Workshop: Testing / End-to-End Tests

## Setup

1. Install cypress by running:

```bash
yarn add -D cypress
```

2. Add tsconfig.json to generated cypress folder:

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["es5", "dom"],
    "types": ["cypress"]
  },
  "include": ["**/*.ts"]
}
```

3. Add the baseUrl to your `cypress.json`:

```json
{ "baseUrl": "http://localhost:4200" }
```

## Add a sanity check

Create a new `e2e.spec.ts` file and add the following first test:

```typescript
it("should do a sanity check", () => {
  cy.visit("");
});
```

## Make an implicit Subject Assertion

We check if the mat-drawer tag has a link which contains the text Holidays

```typescript
it("should do an implicit subject assertion", () => {
  cy.visit("");
  cy.get("mat-drawer a:first").should("have.text", "Holidays");
});
```

## Test via an explicit Subject Assertion

We check again the link for text Holidays. This time, we also check against the class and the link itself.

```typescript
it("should do an explicit subject assertion", () => {
  cy.visit("");
  cy.get("mat-drawer a:first").should(($a) => {
    expect($a).to.have.text("Holidays");
    expect($a).to.have.class("mat-raised-button");
    expect($a).to.have.attr("href", "/holidays");
  });
});
```

## Count the listed customers

Go to the customers list and count the rows:

```typescript
it("should count the entries", () => {
  cy.visit("");
  cy.get("a").contains("Customers").click();
  cy.get("div.row:not(.header)").should("have.length", 22);
});
```

## Edit a customer's firstname

Rename Latitia to Laetitia via the form

```typescript
it("should rename Latitia to Laetitia", () => {
  cy.visit("");
  cy.get("a").contains("Customers").click();
  cy.get("div").contains("Latitia Bellitissa").siblings(".edit").click();
  cy.get("input:first").clear().type("Laetitia");
  cy.get("button[type=submit]").click();

  cy.get("div")
    .contains("Bellitissa")
    .should("have.text", "Laetitia Bellitissa");
});
```

## Add a new customer

Add a new customer and check if he appears on the listing page.

```typescript
it.only("should add a new person", () => {
  cy.visit("");
  cy.get("a").contains("Customers").click();
  cy.get("a").contains("Add Customer").click();
  cy.get("input:first").type("Tom");
  cy.get("input:eq(1)").type("Lincoln");
  cy.get("mat-select").click().get("mat-option").contains("USA").click();
  cy.get("input:eq(2)").type("12.10.1995");
  cy.get("button[type=submit]").click();
  cy.get("div").contains("Tom Lincoln");
});
```

## Ensure that the web application loads within a second

```typescript
it("should load page below 1 second", () => {
  cy.visit("/", {
    onBeforeLoad: (win) => {
      win.performance.mark("start-loading");
    },
    onLoad: (win) => {
      win.performance.mark("end-loading");
    },
  })
    .its("performance")
    .then((p) => {
      p.measure("pageLoad", "start-loading", "end-loading");
      const measure = p.getEntriesByName("pageLoad")[0];
      expect(measure.duration).to.be.most(1000);
    });
});
```
