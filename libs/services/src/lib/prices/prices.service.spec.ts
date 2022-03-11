import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";

import { PricesService } from "./prices.service";
import { ApiUrl, Prices } from "@detalluz/api";

describe("PricesService", () => {
  let service: PricesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: ApiUrl, useValue: "" }],
    });
    service = TestBed.inject(PricesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should retrieve prices for a date range", (done) => {
    const mockPrices: Prices = {
      prices: [
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

    service.getPrices("2021-01-01", "2021-01-31").subscribe((prices) => {
      expect(prices).toBeDefined();
      expect(prices.prices).toBeDefined();
      expect(prices.prices.length).toBe(2);
      done();
    });

    httpMock
      .expectOne({
        method: "GET",
        url: `/prices?initDate=2021-01-01&endDate=2021-01-31`,
      })
      .flush(mockPrices);
  });

  it("should handle errors when getting prices", (done) => {
    service.getPrices("2021-01-01", "2021-01-31").subscribe({
      next: jest.fn(),
      error: (error) => {
        expect(error).toBeDefined();
        done();
      },
    });

    httpMock
      .expectOne({
        method: "GET",
        url: `/prices?initDate=2021-01-01&endDate=2021-01-31`,
      })
      .error(new ErrorEvent("fail"), { status: 422 });
  });
});
