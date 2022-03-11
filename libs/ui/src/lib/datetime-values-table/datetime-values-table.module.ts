import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaterialModule } from "@detalluz/material";
import { DatetimeValuesTableComponent } from "./datetime-values-table.component";
import {
  ExtendedMatTooltipDirective,
  TableValueTooltipDirective,
} from "./table-value-tooltip.directive";

@NgModule({
  declarations: [
    DatetimeValuesTableComponent,
    TableValueTooltipDirective,
    ExtendedMatTooltipDirective,
  ],
  imports: [CommonModule, MaterialModule],
  exports: [DatetimeValuesTableComponent],
})
export class DatetimeValuesTableModule {}
