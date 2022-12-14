import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaterialModule } from "@detalluz/material";
import { InvoiceSimulatorComponent } from "./invoice-simulator.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  ContractSelectorModule,
  DatetimeValuesTableModule,
  FixedPriceInvoiceDetailModule,
  InvoiceConfigurationModule,
  PvpcInvoiceDetailModule,
  RangeSelectorModule,
} from "@detalluz/ui";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [InvoiceSimulatorComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule,
    ContractSelectorModule,
    DatetimeValuesTableModule,
    RangeSelectorModule,
    InvoiceConfigurationModule,
    PvpcInvoiceDetailModule,
    FixedPriceInvoiceDetailModule,
  ],
  exports: [InvoiceSimulatorComponent],
})
export class InvoiceSimulatorModule {}
