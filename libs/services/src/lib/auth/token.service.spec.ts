import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";

import { TokenService } from "./token.service";
import { ApiUrl, Token } from "@detalluz/api";

describe("TokenService", () => {
  let service: TokenService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: ApiUrl, useValue: "" }],
    });
    service = TestBed.inject(TokenService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should create a token with valid credentials", (done) => {
    const mockToken: Token = {
      token: "abc",
    };

    service
      .createToken({
        username: "username",
        password: "password",
        target: "fake",
      })
      .subscribe((response) => {
        expect(response).toBeDefined();
        expect(response.token).toBe("abc");
        done();
      });

    httpMock
      .expectOne({
        method: "POST",
        url: "/token",
      })
      .flush(mockToken);
  });

  it("should handle errors when getting prices", (done) => {
    service
      .createToken({
        username: "username",
        password: "wrong_password",
        target: "fake",
      })
      .subscribe({
        next: jest.fn(),
        error: (error) => {
          expect(error).toBeDefined();
          done();
        },
      });

    httpMock
      .expectOne({
        method: "POST",
        url: "/token",
      })
      .error(new ErrorEvent("fail"), { status: 401 });
  });
});
