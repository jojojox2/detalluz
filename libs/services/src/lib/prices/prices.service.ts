import { Inject, Injectable, Optional } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiUrl, Prices } from "@detalluz/api";

@Injectable({
  providedIn: "root",
})
export class PricesService {
  constructor(
    @Optional() @Inject(ApiUrl) private apiUrl = "",
    private http: HttpClient,
  ) {}

  getPrices(initDate: string, endDate: string): Observable<Prices> {
    return this.http.get<Prices>(
      `${this.apiUrl}/prices?initDate=${initDate}&endDate=${endDate}`,
    );
  }
}
