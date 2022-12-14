import { Inject, Injectable, Optional } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiUrl, Contract } from "@detalluz/api";
import { AuthService } from "../auth/auth.service";

@Injectable({
  providedIn: "root",
})
export class ContractsService {
  constructor(
    @Optional() @Inject(ApiUrl) private apiUrl = "",
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  getContracts(): Observable<Contract[]> {
    return this.http.get<Contract[]>(`${this.apiUrl}/contracts`, {
      headers: this.authService.getAuthenticatedHeaders(),
    });
  }
}
