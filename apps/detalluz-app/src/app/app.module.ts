import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";

import { PagesModule } from "./pages/pages.module";
import {
  NavigableAppModule,
  SpinnerInterceptor,
  SpinnerModule,
} from "@detalluz/ui";
import { ServicesModule } from "@detalluz/services";
import { ApiUrl } from "@detalluz/api";
import { environment } from "../environments/environment";
import { DAYJS_DATE_ADAPTER_OPTIONS } from "@detalluz/material";
import { SharedModule } from "@detalluz/shared";
import { HTTP_INTERCEPTORS } from "@angular/common/http";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    PagesModule,
    ServicesModule,
    SharedModule,
    NavigableAppModule,
    SpinnerModule,
  ],
  providers: [
    { provide: ApiUrl, useValue: environment.apiUrl },
    { provide: DAYJS_DATE_ADAPTER_OPTIONS, useValue: { strict: false } },
    { provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
