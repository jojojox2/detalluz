import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";

import { ConfigurationService } from "./configuration.service";
import { ApiUrl, Configuration } from "@detalluz/api";

describe("ConfigurationService", () => {
  let service: ConfigurationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: ApiUrl, useValue: "" }],
    });
    service = TestBed.inject(ConfigurationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should retrieve configuration data", (done) => {
    const mockConfiguration: Configuration = {
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

    service.getConfiguration().subscribe((configuration) => {
      expect(configuration).toBeDefined();
      expect(configuration).toStrictEqual(mockConfiguration);
      done();
    });

    httpMock
      .expectOne({
        method: "GET",
        url: `/configuration`,
      })
      .flush(mockConfiguration);
  });

  it("should handle errors when getting configuration values", (done) => {
    service.getConfiguration().subscribe({
      next: jest.fn(),
      error: (error) => {
        expect(error).toBeDefined();
        done();
      },
    });

    httpMock
      .expectOne({
        method: "GET",
        url: `/configuration`,
      })
      .error(new ErrorEvent("fail"), { status: 500 });
  });
});
