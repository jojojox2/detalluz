import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import {
  AuthService,
  ChargesService,
  ConfigurationService,
  ConsumptionService,
  PricesService,
} from "@detalluz/services";
import { NoticeService } from "@detalluz/ui";
import dayjs from "dayjs";
import { BehaviorSubject, of } from "rxjs";

import { InvoiceSimulatorComponent } from "./invoice-simulator.component";

jest.mock("@detalluz/services");

describe("InvoiceSimulatorComponent", () => {
  let component: InvoiceSimulatorComponent;
  let fixture: ComponentFixture<InvoiceSimulatorComponent>;
  const mockPricesService = {
    getPrices: jest.fn().mockReturnValue(of(null)),
  };
  const mockChargesService = {
    getCharges: jest.fn().mockReturnValue(of(null)),
  };
  const mockConsumptionService = {
    getConsumption: jest.fn().mockReturnValue(of(null)),
  };
  const mockConfigurationService = {
    getConfiguration: jest.fn().mockReturnValue(of(null)),
  };
  const mockAuthenticationSubscriber = new BehaviorSubject<boolean>(false);
  const mockAuthService = {
    isAuthenticated: jest.fn().mockReturnValue(true),
    watchAuthentication: jest
      .fn()
      .mockReturnValue(mockAuthenticationSubscriber),
  };
  const mockRoute = {
    parent: "",
  };
  const mockNoticeService = {
    showMessage: jest.fn(),
    showSuccessMessage: jest.fn(),
    showWarningMessage: jest.fn(),
    showErrorMessage: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvoiceSimulatorComponent],
      providers: [
        { provide: PricesService, useValue: mockPricesService },
        { provide: ChargesService, useValue: mockChargesService },
        { provide: ConsumptionService, useValue: mockConsumptionService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: ConfigurationService, useValue: mockConfigurationService },
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: NoticeService, useValue: mockNoticeService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceSimulatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should set default date values", () => {
    component.resetRange();

    expect(component.range).toBeDefined();
    expect(component.range.initDate).toBeDefined();
    expect(component.range.endDate).toBeDefined();
  });

  it("should get data with valid dates", () => {
    mockPricesService.getPrices = jest.fn().mockReturnValue(of(null));
    mockChargesService.getCharges = jest.fn().mockReturnValue(of(null));
    mockConsumptionService.getConsumption = jest.fn().mockReturnValue(of(null));

    component.isAuthenticated = true;
    component.range = {
      initDate: dayjs(),
      endDate: dayjs(),
    };

    component.updateTables();

    expect(mockPricesService.getPrices).toHaveBeenCalled();
    expect(mockChargesService.getCharges).toHaveBeenCalled();
    expect(mockConsumptionService.getConsumption).toHaveBeenCalled();
  });

  it("should not get data with invalid dates", () => {
    mockPricesService.getPrices = jest.fn().mockReturnValue(of(null));
    mockChargesService.getCharges = jest.fn().mockReturnValue(of(null));
    mockConsumptionService.getConsumption = jest.fn().mockReturnValue(of(null));

    component.isAuthenticated = true;
    component.range = {
      initDate: dayjs(),
      endDate: undefined,
    };

    component.updateTables();

    expect(mockPricesService.getPrices).not.toHaveBeenCalled();
    expect(mockChargesService.getCharges).not.toHaveBeenCalled();
    expect(mockConsumptionService.getConsumption).not.toHaveBeenCalled();
  });

  it("should not retrieve data on unauthenticated user", () => {
    mockPricesService.getPrices = jest.fn().mockReturnValue(of(null));
    mockChargesService.getCharges = jest.fn().mockReturnValue(of(null));
    mockConsumptionService.getConsumption = jest.fn().mockReturnValue(of(null));
    mockAuthenticationSubscriber.next(false);

    component.range = {
      initDate: dayjs(),
      endDate: dayjs(),
    };

    component.updateTables();

    expect(mockPricesService.getPrices).not.toHaveBeenCalled();
    expect(mockChargesService.getCharges).not.toHaveBeenCalled();
    expect(mockConsumptionService.getConsumption).not.toHaveBeenCalled();
  });
});
