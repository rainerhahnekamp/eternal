import { createHoliday } from "@app/holidays/model";
import { sidemenu } from "../page-objects/sidemenu";

describe("init", () => {
  beforeEach(() => {
    cy.visit("");
  });

  it("should rename Latitia to Laetitia", () => {
    cy.findByRole("link", { name: "Customers" }).click();
    cy.findByLabelText(/Latitia/)
      .findByRole("link", { name: "Edit Customer" })
      .click();

    cy.findByRole("textbox", { name: "Firstname" }).clear();
    cy.findByRole("textbox", { name: "Firstname" }).type("Laetitia");
    cy.findByRole("button", { name: "Save" }).click();

    cy.get("[data-testid=row-customer]")
      .should(($rows) => {
        const names = $rows
          .find("[data-testid=name]")
          .toArray()
          .map((element) => element.textContent || "");
        const hasLaetitia = names.some((value) => value.match(/Laetitia/));
        expect(hasLaetitia).to.eq(true);
      })
      .then(($rows) => console.log($rows));
  });

  it("should click on click me", () => {
    cy.findByRole("button", { name: "Click me" }).click();
    cy.findByRole("button", { name: "Unclick me" }).should("be.visible");
  });

  it("should fail", () => {
    let holidaysCount = 0;
    cy.intercept("https://api.eternal-holidays.net/holiday", request => {
      request.continue(response => {
        holidaysCount = response.body.length;
      });
    }).as('request')
    cy.wait("@request");
    cy.openSidemenu("Holidays");
    cy.testid("holiday-card").should("have.length", holidaysCount);
  });
});

it("should verify holidays", () => {
  cy.request("https://api.eternal-holidays.net/holiday").then((response) => {
    const holidaysCount = response.body.length;
    // sidemenu.open('Holidays')
    cy.openSidemenu("Holidays");
    cy.testid("holiday-card").should("have.length", holidaysCount);
  });
});

it("should login", () => {
  cy.login();
  cy.visit("");
  cy.findByText("Welcome John List").should("be.visible");
});

it("should be logged in", () => {
  cy.login();
  cy.visit("");
  cy.findByText("Welcome John List").should("be.visible");
});
})
;
