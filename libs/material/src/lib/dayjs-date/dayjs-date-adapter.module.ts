import { NgModule } from "@angular/core";
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";
import { DayjsDateAdapter } from "./dayjs-date-adapter";
import { MAT_DAYJS_DATE_FORMATS } from "./dayjs-date-formats";

export { DAYJS_DATE_ADAPTER_OPTIONS } from "./dayjs-date-adapter";

@NgModule({
  providers: [
    {
      provide: DateAdapter,
      useClass: DayjsDateAdapter,
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_DAYJS_DATE_FORMATS },
  ],
})
export class MatDayjsDateModule {}
