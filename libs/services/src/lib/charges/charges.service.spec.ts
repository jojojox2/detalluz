import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";

import { ChargesService } from "./charges.service";
import { ApiUrl, Charges } from "@detalluz/api";

describe("ChargesService", () => {
  let service: ChargesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: ApiUrl, useValue: "" }],
    });
    service = TestBed.inject(ChargesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should retrieve charges for a date range", (done) => {
    const mockCharges: Charges = {
      charges: [
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

    service.getCharges("2021-01-01", "2021-01-31").subscribe((response) => {
      expect(response).toBeDefined();
      expect(response.charges).toBeDefined();
      expect(response.charges.length).toBe(2);
      done();
    });

    httpMock
      .expectOne({
        method: "GET",
        url: `/charges?initDate=2021-01-01&endDate=2021-01-31`,
      })
      .flush(mockCharges);
  });

  it("should handle errors when getting charges", (done) => {
    service.getCharges("2021-01-01", "2021-01-31").subscribe({
      next: jest.fn(),
      error: (error) => {
        expect(error).toBeDefined();
        done();
      },
    });

    httpMock
      .expectOne({
        method: "GET",
        url: `/charges?initDate=2021-01-01&endDate=2021-01-31`,
      })
      .error(new ErrorEvent("fail"), { status: 422 });
  });
});
