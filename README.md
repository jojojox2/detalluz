

# Detalluz

This project provides an Angular application using ExpressJS for the backend (used as serverless lambdas), in order to display and check the electricity prices for the PVPC rate in Spain, in a period of time.

When using credentials for the i-DE or E-REDES electricity distributors, it allows to check the consumption and create an invoice simulation.



This project was generated using [Nx](https://nx.dev), and uses [yarn](https://classic.yarnpkg.com/) as a dependency management.


## Website

This application is deployed in [https://detalluz.netlify.app/](https://detalluz.netlify.app/) via [Netlify](https://www.netlify.com/).

The backend is deployed in [https://detalluz-api.cyclic.app/](https://detalluz-api.cyclic.app/) via [Cyclic](https://www.cyclic.sh/).

## Installation

After [installing yarn](https://classic.yarnpkg.com/lang/en/docs/install/) locally, just run `yarn install` in the root folder and all dependencies will be installed.

## Development server

Run `yarn start` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

Both frontend and backend servers will automatically start (backend will start by default in port 3000).

## Build

Run `yarn build` to build the project, both frontend and backend, by default with a production configuration.

The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `yarn test` to execute the unit tests via [Jest](https://jestjs.io).

## Running end-to-end tests

Run `yarn e2e` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

## Code quality

Run `yarn lint` to execute the analysis of code quality via [ESLint](https://eslint.org/).
