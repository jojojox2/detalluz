import { Inject, Injectable, Optional } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiUrl, Consumption } from "@detalluz/api";
import { AuthService } from "../auth/auth.service";

@Injectable({
  providedIn: "root",
})
export class ConsumptionService {
  constructor(
    @Optional() @Inject(ApiUrl) private apiUrl = "",
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  getConsumption(
    initDate: string,
    endDate: string,
    id?: string,
  ): Observable<Consumption> {
    let url = `${this.apiUrl}/consumption?initDate=${initDate}&endDate=${endDate}`;

    if (id) {
      url += `&id=${id}`;
    }
    return this.http.get<Consumption>(url, {
      headers: this.authService.getAuthenticatedHeaders(),
    });
  }
}
