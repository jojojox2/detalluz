import { Inject, Injectable, Optional } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiUrl, Configuration } from "@detalluz/api";

@Injectable({
  providedIn: "root",
})
export class ConfigurationService {
  constructor(
    @Optional() @Inject(ApiUrl) private apiUrl = "",
    private http: HttpClient,
  ) {}

  getConfiguration(): Observable<Configuration> {
    return this.http.get<Configuration>(`${this.apiUrl}/configuration`);
  }
}
