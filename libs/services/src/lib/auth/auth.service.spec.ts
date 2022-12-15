import { TestBed } from "@angular/core/testing";

import { Token } from "@detalluz/api";
import { of } from "rxjs";

import { AuthService, TOKEN_STORAGE_KEY } from "./auth.service";
import { TokenService } from "./token.service";

describe("AuthService", () => {
  let service: AuthService;
  let mockTokenService: Partial<TokenService>;

  beforeEach(() => {
    mockTokenService = {
      createToken: jest.fn().mockReturnValue(
        of<Token>({
          token: "abc",
        }),
      ),
    };

    TestBed.configureTestingModule({
      providers: [
        {
          provide: TokenService,
          useValue: mockTokenService,
        },
        {
          provide: TOKEN_STORAGE_KEY,
          useValue: "token",
        },
      ],
    });
    service = TestBed.inject(AuthService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should authenticate a user with valid credentials", (done) => {
    service.createToken("target", "username", "password").subscribe(() => {
      expect(service.isAuthenticated()).toBe(true);
      expect(service.getToken()).toBe("abc");
      expect(sessionStorage.getItem("token")).toBe("abc");
      expect(localStorage.getItem("token")).toBeNull();
      done();
    });
  });

  it("should store the token in browser storage", (done) => {
    service
      .createToken("target", "username", "password", true)
      .subscribe(() => {
        expect(sessionStorage.getItem("token")).toBe("abc");
        expect(localStorage.getItem("token")).toBe("abc");
        done();
      });
  });

  it("should remove a saved token", (done) => {
    service
      .createToken("target", "username", "password", true)
      .subscribe(() => {
        expect(service.getToken()).toBe("abc");

        service.removeToken();

        expect(service.getToken()).toBeNull();
        expect(sessionStorage.getItem("token")).toBeNull();
        expect(localStorage.getItem("token")).toBeNull();
        done();
      });
  });

  it("should create authenticated http headers", (done) => {
    service.createToken("target", "username", "password").subscribe(() => {
      expect(service.getToken()).toBe("abc");

      const headers = service.getAuthenticatedHeaders();

      expect(headers).toBeDefined();
      expect(headers.Authorization).toBe("Bearer abc");
      done();
    });
  });

  it("should emit changes in authentication", (done) => {
    let firstEvent = true;
    service.removeToken();
    service.watchAuthentication().subscribe((isAuthenticated) => {
      if (firstEvent) {
        expect(isAuthenticated).toBe(false);
        firstEvent = false;
      } else {
        expect(isAuthenticated).toBe(true);
        done();
      }
    });
    service.createToken("target", "username", "password").subscribe();
  });
});
