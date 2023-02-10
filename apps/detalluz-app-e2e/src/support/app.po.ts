// Homepage
export const getPageTitle = () => cy.get("h1");

export const getRedirectButton = () =>
  cy.get(".redirect-button-section button");

// Invoice simulator
export const getLoginWarning = () => cy.get(".login-warning-card");
export const getLoginWarningLink = () =>
  getLoginWarning().get("a").contains("login");

export const getInvoiceConfiguration = () =>
  cy.get("dtl-invoice-configuration");

export const getInvoicesTabs = () => cy.get("[role='tablist']");
export const getPVPCInvoiceTab = () =>
  getInvoicesTabs().get("[role='tab']").contains("PVPC");
export const getFixedPriceInvoiceTab = () =>
  getInvoicesTabs().get("[role='tab']").contains("Fixed price");

export const getPVPCInvoiceDetail = () => cy.get("dtl-pvpc-invoice-detail");
export const getFixedPriceInvoiceDetail = () =>
  cy.get("dtl-fixed-price-invoice-detail");

// Common
export const getRangeSelector = () => cy.get("dtl-range-selector");
export const getRangeInitDate = () => getRangeSelector().get("input:first");
export const getRangeLastDate = () => getRangeSelector().get("input:last");
export const getRangeSelectorCalendarButton = () =>
  getRangeSelector().get("mat-datepicker-toggle button");
export const getCalendarFirstDay = () =>
  cy.get("button.mat-calendar-body-cell:first");
export const getCalendarLastDay = () =>
  cy.get("button.mat-calendar-body-cell:last");

export const getHourlyValuesTable = () => cy.get("dtl-datetime-values-table");

export const getToolbar = () => cy.get(".toolbar");
export const getSidenav = () => cy.get(".sidenav");
export const getMenuButton = () => cy.get("button[title='Menu']");
export const getSidenavHomepageLink = () => getSidenav().get("a[href='/']");
export const getSidenavInvoiceSimulatorLink = () =>
  getSidenav().get("a[href='/invoice-simulator']");
export const getSidenavInfoLink = () => getSidenav().get("a[href='/info']");

export const getLoginDialog = () => cy.get("dtl-login-dialog");
export const getLoginUsername = () =>
  getLoginDialog().get("input[formcontrolname='username']");
export const getLoginPassword = () =>
  getLoginDialog().get("input[formcontrolname='password']");
export const getLoginButton = () =>
  getLoginDialog().get("button[type='submit']");
