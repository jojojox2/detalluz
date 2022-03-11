import { HttpClient, HTTP_INTERCEPTORS } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";

import { SpinnerInterceptor } from "./spinner.interceptor";
import { SpinnerService } from "./spinner.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class HttpTestService {
  constructor(private http: HttpClient) {}

  execute(): Observable<string> {
    return this.http.get<string>("/test-url");
  }
}

describe("SpinnerInterceptor", () => {
  let httpMock: HttpTestingController;
  let spinnerServiceMock: Partial<SpinnerService>;
  let httpTestService: HttpTestService;

  beforeEach(() => {
    spinnerServiceMock = {
      show: jest.fn(),
      hide: jest.fn(),
    };
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: SpinnerService,
          useValue: spinnerServiceMock,
        },
        {
          provide: HttpTestService,
          useClass: HttpTestService,
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: SpinnerInterceptor,
          multi: true,
        },
      ],
    });
    httpMock = TestBed.inject(HttpTestingController);
    httpTestService = TestBed.inject(HttpTestService);
  });

  it("should intercept http successful calls", () => {
    httpTestService.execute().subscribe();

    const req = httpMock.expectOne("/test-url");
    req.flush(null);
    httpMock.verify();

    expect(spinnerServiceMock.show).toHaveBeenCalledWith("HTTP GET /test-url");
    expect(spinnerServiceMock.hide).toHaveBeenCalledWith("HTTP GET /test-url");
  });

  it("should intercept http calls with errors", () => {
    httpTestService.execute().subscribe();

    httpMock
      .expectOne("/test-url")
      .error(new ErrorEvent("fail"), { status: 400 });
    httpMock.verify();

    expect(spinnerServiceMock.show).toHaveBeenCalledWith("HTTP GET /test-url");
    expect(spinnerServiceMock.hide).toHaveBeenCalledWith("HTTP GET /test-url");
  });
});
