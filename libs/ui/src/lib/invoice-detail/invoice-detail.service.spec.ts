import { DecimalPipe } from "@angular/common";
import { TestBed } from "@angular/core/testing";
import {
  Consumption,
  Period,
  TemporalConfigurationValue,
  TemporalPeriodConfiguration,
} from "@detalluz/api";
import { DayjsService, Defined, NumberUtilsService } from "@detalluz/shared";
import dayjs from "dayjs";
import { InvoiceConfiguration } from "../invoice-configuration/invoice-configuration.component";
import { RangeSelectorForm } from "../range-selector/range-selector.component";
import { InvoiceConcept } from "./invoice-detail.component";

import { InvoiceDetailService } from "./invoice-detail.service";

describe("InvoiceDetailService", () => {
  let service: InvoiceDetailService;

  const exampleRange: Defined<RangeSelectorForm> = {
    initDate: dayjs("2020-01-01T00:00:00.000+01:00"),
    endDate: dayjs("2020-01-02T00:00:00.000+01:00"),
  };
  const exampleInvoiceConfiguration: InvoiceConfiguration = {
    peakHiredPower: 1,
    valleyHiredPower: 1,
  };
  const exampleConsumption: Consumption = {
    consumption: [
      {
        date: "2020-01-01T00:00:00.000+01:00",
        value: 10,
      },
      {
        date: "2020-01-02T00:00.000+01:00",
        value: 20,
      },
      {
        date: "2020-01-03T00:00.000+01:00",
        value: 30,
      },
      {
        date: "2020-01-04T06:00.000+01:00",
        value: 40,
      },
      {
        date: "2020-01-04T09:00.000+01:00",
        value: 50,
      },
      {
        date: "2020-01-04T11:00.000+01:00",
        value: 60,
      },
    ],
  };
  const exampleConfiguration = {
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
    },
    energyCosts: {
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
    holidays: ["2022-01-01"],
  };
  const exampleTemporalPeriodConfiguration: TemporalPeriodConfiguration[] = [
    {
      value: {
        P1: 0.01,
        P2: 0.02,
        P3: 0.03,
      },
      unit: "X",
      validUntil: "2020-01-01",
    },
    {
      value: {
        P1: 1.01,
        P2: 1.02,
        P3: 1.03,
      },
      unit: "X",
      validFrom: "2020-01-02",
    },
  ];
  const exampleTemporalConfigurationValue: TemporalConfigurationValue[] = [
    {
      value: 0.1,
      unit: "X",
      validUntil: "2020-01-01",
    },
    {
      value: 0.2,
      unit: "X",
      validFrom: "2020-01-02",
    },
  ];
  const exampleConsumptionByDay: Record<string, Record<Period, number>> = {
    "20200101": {
      P1: 1,
      P2: 2,
      P3: 3,
    },
    "20200102": {
      P1: 0,
      P2: 0,
      P3: 4,
    },
    "20200103": {
      P1: 0,
      P2: 0,
      P3: 5,
    },
    "20200104": {
      P1: 6,
      P2: 7,
      P3: 8,
    },
  };
  const exampleConcepts: InvoiceConcept[] = [
    {
      title: "Concept A",
      value: 3,
      subconcepts: [
        {
          title: "Subconcept A.1",
          value: 1,
        },
        {
          title: "Subconcept A.2",
          value: 2,
        },
      ],
    },
    {
      title: "Concept B",
      calculationDetail: "(insert formula here)",
      value: 10,
    },
  ];
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DayjsService, NumberUtilsService, DecimalPipe],
    });
    service = TestBed.inject(InvoiceDetailService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("calculatePowerCostsSubconceptsByPeriod", () => {
    it("should generate subconcepts", () => {
      const subconcepts = service.calculatePowerCostsSubconceptsByPeriod(
        exampleTemporalPeriodConfiguration,
        "title",
        exampleRange,
        exampleInvoiceConfiguration,
      );
      expect(subconcepts).toBeDefined();
    });
  });

  describe("calculatePowerCostsSubconceptsByValue", () => {
    it("should generate subconcepts", () => {
      const subconcepts = service.calculatePowerCostsSubconceptsByValue(
        exampleTemporalConfigurationValue,
        "title",
        exampleRange,
        1,
      );
      expect(subconcepts).toBeDefined();
    });
  });

  describe("calculateEnergyCostsSubconceptsByPeriod", () => {
    it("should generate subconcepts", () => {
      const subconcepts = service.calculateEnergyCostsSubconceptsByPeriod(
        exampleTemporalPeriodConfiguration,
        exampleConsumptionByDay,
        "title",
        exampleRange,
      );
      expect(subconcepts).toBeDefined();
    });
  });

  describe("calculateEnergyCostsSubconceptsByValue", () => {
    it("should generate subconcepts", () => {
      const subconcepts = service.calculateEnergyCostsSubconceptsByValue(
        exampleTemporalConfigurationValue,
        exampleConsumptionByDay,
        "title",
        exampleRange,
      );
      expect(subconcepts).toBeDefined();
    });

    it("should aggregate subconcepts into parent when only one is present", () => {
      const subconcepts = service.calculateEnergyCostsSubconceptsByValue(
        [exampleTemporalConfigurationValue[0]],
        exampleConsumptionByDay,
        "title",
        exampleRange,
      );
      expect(subconcepts).toBeDefined();
      expect(subconcepts).toHaveLength(1);
      expect(subconcepts[0].subconcepts).not.toBeDefined();
    });
  });

  describe("calculatePercentageConcept", () => {
    it("should generate concept", () => {
      const concept = service.calculatePercentageConcept(
        exampleConcepts,
        "title",
        exampleTemporalConfigurationValue,
        exampleRange,
      );
      expect(concept).toBeDefined();
    });
  });

  describe("calculateDailyCost", () => {
    it("should generate concept", () => {
      const concept = service.calculateDailyCost(
        "title",
        exampleRange,
        exampleTemporalConfigurationValue,
      );
      expect(concept).toBeDefined();
    });
  });

  describe("calculateConsumptionByDay", () => {
    it("should calculate consumption", () => {
      const consumptionByDay = service.calculateConsumptionByDay(
        exampleConsumption,
        exampleConfiguration,
      );
      expect(consumptionByDay).toBeDefined();
      expect(consumptionByDay["20200101"]).toBeDefined();
    });

    it("should ignore invalid dates", () => {
      const consumptionByDay = service.calculateConsumptionByDay(
        { consumption: [{ date: "XX", value: 1 }] },
        exampleConfiguration,
      );
      expect(consumptionByDay).toBeDefined();
      expect(Object.keys(consumptionByDay)).toHaveLength(0);
    });
  });

  describe("calculateSumConcept", () => {
    it("should generate concept", () => {
      const concept = service.calculateSumConcept(
        exampleConcepts,
        "title",
        "total",
      );
      expect(concept).toBeDefined();
    });
  });

  describe("sumConceptsValues", () => {
    it("should generate concept", () => {
      const value = service.sumConceptsValues(exampleConcepts);
      expect(value).toBeDefined();
      expect(value).toBe(13);
    });
  });
});
