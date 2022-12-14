import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";

import { ContractsService } from "./contracts.service";
import { ApiUrl, Contract } from "@detalluz/api";
import { AuthService } from "../auth/auth.service";

describe("ContractsService", () => {
  let service: ContractsService;
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
    service = TestBed.inject(ContractsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should retrieve a contracts list", (done) => {
    const mockConsumption: Contract[] = [
      {
        id: "123",
        cups: "ESXX",
        address: "Fake street 123",
      },
    ];

    service.getContracts().subscribe((response) => {
      expect(response).toBeDefined();
      expect(response.length).toBe(1);
      done();
    });

    httpMock
      .expectOne({
        method: "GET",
        url: `/contracts`,
      })
      .flush(mockConsumption);
  });

  it("should handle errors when getting contracts", (done) => {
    service.getContracts().subscribe({
      next: jest.fn(),
      error: (error) => {
        expect(error).toBeDefined();
        done();
      },
    });

    httpMock
      .expectOne({
        method: "GET",
        url: `/contracts`,
      })
      .error(new ErrorEvent("fail"), { status: 422 });
  });
});
