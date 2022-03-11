import { Inject, Injectable, Optional } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiUrl, Charges } from "@detalluz/api";

@Injectable({
  providedIn: "root",
})
export class ChargesService {
  constructor(
    @Optional() @Inject(ApiUrl) private apiUrl = "",
    private http: HttpClient,
  ) {}

  getCharges(initDate: string, endDate: string): Observable<Charges> {
    return this.http.get<Charges>(
      `${this.apiUrl}/charges?initDate=${initDate}&endDate=${endDate}`,
    );
  }
}
