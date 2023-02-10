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
  getInvoicesTabs,
  getPVPCInvoiceDetail,
  getFixedPriceInvoiceTab,
  getFixedPriceInvoiceDetail,
  getSidenavInfoLink,
} from "../support/app.po";

describe("detalluz-app", () => {
  before(() => {
    cy.setMocks();
    cy.clearSession();
    cy.visit("/");
  });

  beforeEach(function () {
    cy.setMocks();
  });

  it("should display homepage", () => {
    cy.wait(["@getPrices"]);

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

    cy.wait("@getConfiguration");

    getLoginWarning().should("be.visible");
  });

  it("should open login dialog", () => {
    getLoginWarningLink().click();
    getLoginDialog().should("be.visible");
  });

  it("should login with valid data and display invoice simulation", () => {
    getLoginUsername().type("test@example.com");
    getLoginPassword().type("123456");
    getLoginButton().click();

    cy.wait("@postToken");
    cy.wait("@getPrices");
    cy.wait("@getConsumption");

    getRangeSelector().should("be.visible");
    getInvoiceConfiguration().should("be.visible");
    getInvoicesTabs().should("be.visible");
    getPVPCInvoiceDetail().should("be.visible");
  });

  it("should allow to change to fixed price invoice simulation", () => {
    getFixedPriceInvoiceTab().click();
    getFixedPriceInvoiceDetail().should("be.visible");
  });

  it("should navigate to info page", () => {
    getMenuButton().click();
    getSidenav().should("be.visible");
    getSidenavInfoLink().click();
    cy.location("pathname").should("eq", "/info");
  });
});
