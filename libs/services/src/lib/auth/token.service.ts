import { Inject, Injectable, Optional } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiUrl, LoginData, Token } from "@detalluz/api";

@Injectable({
  providedIn: "root",
})
export class TokenService {
  constructor(
    @Optional() @Inject(ApiUrl) private apiUrl = "",
    private http: HttpClient,
  ) {}

  createToken(loginData: LoginData): Observable<Token> {
    return this.http.post<Token>(`${this.apiUrl}/token`, loginData);
  }
}
