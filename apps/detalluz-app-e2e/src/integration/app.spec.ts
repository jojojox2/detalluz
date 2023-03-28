import {
  getRedirectButton,
  getPageTitle,
  getRangeSelector,
  getHourlyValuesTable,
  getMenuButton,
  getSidenav,
  getLoginDialog,
  getRangeInitDate,
  getRangeLastDate,
  getRangeSelectorCalendarButton,
  getCalendarFirstDay,
  getCalendarLastDay,
  getLoginWarning,
  getLoginWarningLink,
  getLoginUsername,
  getLoginPassword,
  getLoginButton,
  getInvoiceConfiguration,
  getPVPCInvoiceDetail,
  getSidenavInfoLink,
} from "../support/app.po";

describe("detalluz-app", () => {
  before(() => {
    cy.setMocks();
    cy.clearSession();
  });

  beforeEach(function () {
    cy.setMocks();
    cy.visit("/");
    cy.wait(["@getPrices"]);
  });

  it("should display homepage", () => {
    getPageTitle().contains("Welcome to Detalluz!");
    getRedirectButton()
      .should("be.enabled")
      .contains("Go to the invoice simulator");
    getRangeSelector().get("input").should("be.enabled");
    getHourlyValuesTable().should("be.visible");
    getHourlyValuesTable().get("tbody tr").should("have.length", 2); // 2 days defined in mocks
  });

  it("should update prices on range input change", () => {
    getRangeInitDate().clear();
    getRangeLastDate().clear();
    getRangeInitDate().type("01/01/2022");
    getRangeLastDate().type("02/01/2022");

    cy.wait("@getPrices")
      .its("request.url")
      .should("contain", "?initDate=2022-01-01&endDate=2022-01-02");
  });

  it("should update prices with calendar selection", () => {
    getRangeSelectorCalendarButton().click();
    getCalendarFirstDay().click();
    getCalendarLastDay().click();

    cy.wait("@getPrices");
  });

  it("should open and close side menu", () => {
    getMenuButton().click();
    getSidenav().should("be.visible");
    getMenuButton().click();
    getSidenav().should("not.be.visible");
  });

  it("should navigate to invoice simulator page", () => {
    getRedirectButton().click();
    cy.location("pathname").should("eq", "/invoice-simulator");

    getLoginWarning().should("be.visible");
  });

  it("should open login dialog", () => {
    cy.visit("/invoice-simulator");

    getLoginWarningLink().click();
    getLoginDialog().should("be.visible");
  });

  it("should login with valid data and display invoice simulation", () => {
    cy.visit("/invoice-simulator");
    getLoginWarningLink().click();

    getLoginUsername().type("test@example.com");
    getLoginPassword().type("123456");
    getLoginButton().click();

    cy.wait("@postToken");
    cy.wait("@getConfiguration");
    cy.wait("@getPrices");
    cy.wait("@getConsumption");

    getRangeSelector().should("be.visible");
    getInvoiceConfiguration().should("be.visible");
    getPVPCInvoiceDetail().should("be.visible");
  });

  it("should navigate to info page", () => {
    getMenuButton().click();
    getSidenav().should("be.visible");
    getSidenavInfoLink().click();
    cy.location("pathname").should("eq", "/info");
  });
});
