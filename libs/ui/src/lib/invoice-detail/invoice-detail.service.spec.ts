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
import {
  InvoiceConcept,
  InvoiceEntry,
  InvoicePeriodEntry,
  InvoiceRangedEntry,
} from "./invoice-detail.model";

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
  const exampleInvoiceEntries: (InvoiceEntry | InvoicePeriodEntry)[] = [
    {
      initDate: dayjs(),
      endDate: dayjs(),
      value: 3,
      P1: {
        initDate: dayjs(),
        endDate: dayjs(),
        value: 1,
      },
      P2: {
        initDate: dayjs(),
        endDate: dayjs(),
        value: 2,
      },
    },
    {
      initDate: dayjs(),
      endDate: dayjs(),
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

  describe("calculatePowerCostsByPeriod", () => {
    it("should generate an entry", () => {
      const invoiceRangedEntry = service.calculatePowerCostsByPeriod(
        exampleTemporalPeriodConfiguration,
        exampleRange,
        exampleInvoiceConfiguration,
      );
      expect(invoiceRangedEntry).toBeDefined();
    });
  });

  describe("calculatePowerCostsByValue", () => {
    it("should generate an entry", () => {
      const invoiceRangedEntry = service.calculatePowerCostsByValue(
        exampleTemporalConfigurationValue,
        exampleRange,
        1,
      );
      expect(invoiceRangedEntry).toBeDefined();
    });
  });

  describe("calculateEnergyCostsByPeriod", () => {
    it("should generate an entry", () => {
      const invoiceRangedEntry = service.calculateEnergyCostsByPeriod(
        exampleTemporalPeriodConfiguration,
        exampleConsumptionByDay,
        exampleRange,
      );
      expect(invoiceRangedEntry).toBeDefined();
    });
  });

  describe("calculateEnergyCostsByValue", () => {
    it("should generate an entry", () => {
      const invoiceRangedEntry = service.calculateEnergyCostsByValue(
        exampleTemporalConfigurationValue,
        exampleConsumptionByDay,
        exampleRange,
      );
      expect(invoiceRangedEntry).toBeDefined();
    });
  });

  describe("calculatePercentage", () => {
    it("should generate an entry", () => {
      const entry = service.calculatePercentage(
        exampleInvoiceEntries,
        exampleTemporalConfigurationValue,
        exampleRange,
      );
      expect(entry).toBeDefined();
    });
  });

  describe("calculateDailyCost", () => {
    it("should generate an entry", () => {
      const entry = service.calculateDailyCost(
        exampleRange,
        exampleTemporalConfigurationValue,
      );
      expect(entry).toBeDefined();
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

  describe("calculateSum", () => {
    it("should generate an entry", () => {
      const entry = service.calculateSum(exampleInvoiceEntries, exampleRange);
      expect(entry).toBeDefined();
    });
  });

  describe("sumValues", () => {
    it("should sum all values", () => {
      const value = service.sumValues(exampleInvoiceEntries);
      expect(value).toBeDefined();
      expect(value).toBe(13);
    });
  });

  describe("buildInvoiceConcept", () => {
    it("should build a power invoice concept", () => {
      const value = service.buildInvoiceConcept(
        "title",
        exampleInvoiceEntries[0],
        exampleInvoiceEntries,
        service.powerSubconceptsTitles,
      );
      expect(value).toBeDefined();
    });

    it("should build an energy invoice concept", () => {
      const value = service.buildInvoiceConcept(
        "title",
        exampleInvoiceEntries[1],
        exampleInvoiceEntries,
        service.energySubconceptsTitles,
      );
      expect(value).toBeDefined();
    });
  });
});
