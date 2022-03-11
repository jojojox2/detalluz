

# Detalluz

This project provides an Angular application using Lambda functions, in order to display and check the electricity prices for the PVPC rate in Spain, in a period of time.

When using credentials for the i-DE electricity distributor, it allows to check the consumption and create an invoice simulation.



This project was generated using [Nx](https://nx.dev), and uses [yarn](https://classic.yarnpkg.com/) as a dependency management.


## Website

This application is deployed in [https://detalluz.netlify.app/](https://detalluz.netlify.app/) via [Netlify](https://www.netlify.com/).

[![Netlify Status](https://api.netlify.com/api/v1/badges/ead61200-03fe-4d5e-849a-1c7aa7e4b7c0/deploy-status)](https://app.netlify.com/sites/detalluz/deploys)

## Installation

After [installing yarn](https://classic.yarnpkg.com/lang/en/docs/install/) locally, just run `yarn install` in the root folder and all dependencies will be installed.

## Development server

Run `yarn start` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

Both frontend and backend servers will automatically start (backend for lambda functions will start by default in port 9000).

## Build

Run `yarn build` to build the project, both frontend and lambda functions, by default with a production configuration.

The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `yarn test` to execute the unit tests via [Jest](https://jestjs.io).

## Running end-to-end tests

Run `yarn e2e` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

## Code quality

Run `yarn lint` to execute the analysis of code quality via [ESLint](https://eslint.org/).
