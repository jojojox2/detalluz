// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    clearSession(): void;
  }
}

Cypress.Commands.add("clearSession", () => {
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.window().then((win) => {
    win.sessionStorage.clear();
  });
});
