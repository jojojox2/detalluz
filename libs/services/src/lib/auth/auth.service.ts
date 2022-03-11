import { Inject, Injectable, Optional } from "@angular/core";
import { BehaviorSubject, map, Observable } from "rxjs";
import { LoginData } from "@detalluz/api";
import { TokenService } from "./token.service";

/** Key to store session token in SessionStorage/LocalStorage */
export const TOKEN_STORAGE_KEY = "TOKEN_STORAGE_KEY";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(
    private tokenService: TokenService,
    @Optional() @Inject(TOKEN_STORAGE_KEY) private tokenKey: string,
  ) {
    if (!this.tokenKey) {
      this.tokenKey = "token";
    }

    this.retrieveStoredToken();
  }

  private token: string | null = null;

  private authenticationSubject = new BehaviorSubject<boolean>(
    this.isAuthenticated(),
  );

  createToken(
    username: string,
    password: string,
    rememberSession?: boolean,
  ): Observable<void> {
    this.token = null;
    const loginData: LoginData = {
      username: username,
      password: password,
    };

    return this.tokenService.createToken(loginData).pipe(
      map((response) => {
        this.token = response?.token;
        this.storeToken(rememberSession);
      }),
    );
  }

  removeToken(): void {
    this.token = null;
    this.storeToken();
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  watchAuthentication(): Observable<boolean> {
    return this.authenticationSubject;
  }

  getToken(): string | null {
    return this.token;
  }

  getAuthenticatedHeaders(): { Authorization?: string } {
    if (this.token) {
      return {
        Authorization: `Bearer ${this.token}`,
      };
    } else {
      return {};
    }
  }

  private storeToken(rememberSession?: boolean) {
    if (this.token) {
      sessionStorage.setItem(this.tokenKey, this.token);
      if (rememberSession) {
        localStorage.setItem(this.tokenKey, this.token);
      } else {
        localStorage.removeItem(this.tokenKey);
      }
    } else {
      sessionStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.tokenKey);
    }
    this.authenticationSubject.next(this.isAuthenticated());
  }

  private retrieveStoredToken(): void {
    let token = sessionStorage.getItem(this.tokenKey);

    if (!token) {
      token = localStorage.getItem(this.tokenKey);
    }

    this.token = token;
    this.authenticationSubject.next(this.isAuthenticated());
  }
}
