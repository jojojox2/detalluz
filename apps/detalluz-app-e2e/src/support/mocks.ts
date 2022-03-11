// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    setMocks(): void;
  }
}

Cypress.Commands.add("setMocks", () => {
  cy.intercept("/api/prices*", {
    fixture: "get-prices.json",
  }).as("getPrices");

  cy.intercept("/api/charges*", {
    fixture: "get-charges.json",
  }).as("getCharges");

  cy.intercept("/api/consumption*", {
    fixture: "get-consumption.json",
  }).as("getConsumption");

  cy.intercept("/api/configuration*", {
    fixture: "get-configuration.json",
  }).as("getConfiguration");

  cy.intercept("/api/token*", {
    fixture: "post-token.json",
  }).as("postToken");
});
