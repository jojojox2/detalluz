import { Configuration } from "@detalluz/api";

export type DbConfiguration = Configuration;

export const CONFIGURATION_MOCK: Configuration = {
  vat: [
    {
      value: 10,
      unit: "%",
    },
  ],
  electricityTax: [
    {
      value: 0.5,
      unit: "%",
    },
  ],
  meterRental: [
    {
      value: 0.02663,
      unit: "€/d",
    },
  ],
  marketingMargin: [
    {
      value: 0.008529,
      unit: "€/kW/d",
    },
  ],
  powerCosts: {
    distributionTolls: [
      {
        value: {
          P1: 0.062982,
          P2: 0.002572,
        },
        unit: "€/kW/d",
      },
    ],
    charges: [
      {
        value: {
          P1: 0.013618,
          P2: 0.000876,
        },
        unit: "€/kW/d",
      },
    ],
  },
  energyCosts: {
    tolls: [
      {
        value: {
          P1: 0.027787,
          P2: 0.019146,
          P3: 0.000703,
        },
        unit: "€/kWh",
      },
    ],
    charges: [
      {
        value: {
          P1: 0.072969,
          P2: 0.014594,
          P3: 0.003648,
        },
        unit: "€/kWh",
      },
    ],
  },
  holidays: [
    "2022-01-01",
    "2022-01-06",
    "2022-04-15",
    "2022-08-15",
    "2022-10-12",
    "2022-11-01",
    "2022-12-06",
    "2022-12-08",
  ],
  fixedPrice: {
    powerCosts: [
      {
        value: {
          P1: 0.047561,
          P2: 0.054542,
        },
        unit: "€/kW/d",
      },
    ],
    energyCosts: [
      {
        value: 0.145152,
        unit: "€/kWh",
      },
    ],
  },
  communityElectricityTax: [
    {
      value: 0.001,
      unit: "€/kWh",
    },
  ],
};
