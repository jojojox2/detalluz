import { DecimalPipe } from "@angular/common";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Consumption } from "@detalluz/api";
import dayjs from "dayjs";
import { InvoiceConfiguration } from "../../invoice-configuration/invoice-configuration.component";
import { RangeSelectorForm } from "../../range-selector/range-selector.component";
import { InvoiceDetailService } from "../invoice-detail.service";

import { FixedPriceInvoiceDetailComponent } from "./fixed-price-invoice-detail.component";

describe("FixedPriceInvoiceDetailComponent", () => {
  let component: FixedPriceInvoiceDetailComponent;
  let fixture: ComponentFixture<FixedPriceInvoiceDetailComponent>;
  let mockInvoiceDetailService: Partial<InvoiceDetailService>;

  const exampleRange: RangeSelectorForm = {
    initDate: dayjs("2020-01-01"),
    endDate: dayjs("2020-01-07"),
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
  const exampleConcepts = [
    {
      title: "example",
    },
  ];

  beforeEach(async () => {
    mockInvoiceDetailService = {
      calculatePowerCostsByPeriod: jest.fn().mockReturnValue({ ranges: [] }),
      calculatePowerCostsByValue: jest.fn().mockReturnValue({ ranges: [] }),
      calculateEnergyCostsByPeriod: jest.fn().mockReturnValue({ ranges: [] }),
      calculateEnergyCostsByValue: jest.fn().mockReturnValue({ ranges: [] }),
      calculatePercentage: jest.fn().mockReturnValue({}),
      calculateDailyCost: jest.fn().mockReturnValue({}),
      calculateConsumptionByDay: jest.fn().mockReturnValue({}),
      calculateSum: jest.fn().mockReturnValue({}),
      sumValues: jest.fn().mockReturnValue(0),
      buildInvoiceConcept: jest.fn().mockReturnValue({}),
      powerSubconceptsTitles: {},
      energySubconceptsTitles: {},
    };

    await TestBed.configureTestingModule({
      declarations: [FixedPriceInvoiceDetailComponent],
      providers: [
        DecimalPipe,
        {
          provide: InvoiceDetailService,
          useValue: mockInvoiceDetailService,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FixedPriceInvoiceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should show a list of concepts", () => {
    component.range = exampleRange;
    component.invoiceConfiguration = exampleInvoiceConfiguration;
    component.consumption = exampleConsumption;
    component.configuration = exampleConfiguration;

    component.ngOnChanges();

    expect(component.concepts).toBeDefined();
    expect(component.concepts).toHaveLength(7);
  });

  it("should ignore invalid inputs", () => {
    component.concepts = exampleConcepts;

    component.range = exampleRange;
    component.invoiceConfiguration = exampleInvoiceConfiguration;
    component.consumption = exampleConsumption;
    component.configuration = exampleConfiguration;

    component.range = {
      initDate: exampleRange.initDate,
    };
    component.ngOnChanges();
    expect(component.concepts).toHaveLength(1);

    component.range = {
      endDate: exampleRange.endDate,
    };
    component.ngOnChanges();
    expect(component.concepts).toHaveLength(1);

    component.range = exampleRange;
    component.invoiceConfiguration = {
      peakHiredPower: exampleInvoiceConfiguration.peakHiredPower,
    };
    component.ngOnChanges();
    expect(component.concepts).toHaveLength(1);

    component.invoiceConfiguration = {
      valleyHiredPower: exampleInvoiceConfiguration.valleyHiredPower,
    };
    component.ngOnChanges();
    expect(component.concepts).toHaveLength(1);
  });

  it("should clear concepts on missing data", () => {
    component.range = exampleRange;
    component.invoiceConfiguration = exampleInvoiceConfiguration;

    component.concepts = exampleConcepts;
    component.consumption = null;
    component.configuration = exampleConfiguration;
    component.ngOnChanges();
    expect(component.concepts).toHaveLength(0);

    component.concepts = exampleConcepts;
    component.consumption = exampleConsumption;
    component.configuration = null;
    component.ngOnChanges();
    expect(component.concepts).toHaveLength(0);
  });
});
