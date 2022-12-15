import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";

import { ConsumptionService } from "./consumption.service";
import { ApiUrl, Consumption } from "@detalluz/api";
import { AuthService } from "../auth/auth.service";

describe("ConsumptionService", () => {
  let service: ConsumptionService;
  let httpMock: HttpTestingController;
  let mockAuthService: Partial<AuthService>;

  beforeEach(() => {
    mockAuthService = {
      getAuthenticatedHeaders: jest.fn().mockReturnValue({
        Authorization: "Bearer abc",
      }),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: ApiUrl, useValue: "" },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    });
    service = TestBed.inject(ConsumptionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should retrieve consumption for a date range", (done) => {
    const mockConsumption: Consumption = {
      consumption: [
        {
          date: "2021-01-01T00:00:00.000+01:00",
          value: 1,
        },
        {
          date: "2021-01-01T01:00:00.000+01:00",
          value: 2,
        },
      ],
    };

    service.getConsumption("2021-01-01", "2021-01-31").subscribe((response) => {
      expect(response).toBeDefined();
      expect(response.consumption).toBeDefined();
      expect(response.consumption.length).toBe(2);
      done();
    });

    httpMock
      .expectOne({
        method: "GET",
        url: `/consumption?initDate=2021-01-01&endDate=2021-01-31`,
      })
      .flush(mockConsumption);
  });

  it("should retrieve consumption for a date range and id", (done) => {
    const mockConsumption: Consumption = {
      consumption: [
        {
          date: "2021-01-01T00:00:00.000+01:00",
          value: 1,
        },
        {
          date: "2021-01-01T01:00:00.000+01:00",
          value: 2,
        },
      ],
    };

    service
      .getConsumption("2021-01-01", "2021-01-31", "ESXX-00")
      .subscribe((response) => {
        expect(response).toBeDefined();
        expect(response.consumption).toBeDefined();
        expect(response.consumption.length).toBe(2);
        done();
      });

    httpMock
      .expectOne({
        method: "GET",
        url: `/consumption?initDate=2021-01-01&endDate=2021-01-31&id=ESXX-00`,
      })
      .flush(mockConsumption);
  });

  it("should handle errors when getting consumption", (done) => {
    service.getConsumption("2021-01-01", "2021-01-31").subscribe({
      next: jest.fn(),
      error: (error) => {
        expect(error).toBeDefined();
        done();
      },
    });

    httpMock
      .expectOne({
        method: "GET",
        url: `/consumption?initDate=2021-01-01&endDate=2021-01-31`,
      })
      .error(new ErrorEvent("fail"), { status: 422 });
  });
});
