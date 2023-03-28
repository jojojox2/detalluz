import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FixedPriceInvoiceDetailComponent } from "./fixed-price-invoice-detail.component";
import { MaterialModule } from "@detalluz/material";
import { InvoiceConfigurationModule } from "../../invoice-configuration/invoice-configuration.module";
import { InvoiceDetailModule } from "../invoice-detail.module";

export * from "./fixed-price-invoice-detail.model";

@NgModule({
  declarations: [FixedPriceInvoiceDetailComponent],
  imports: [
    CommonModule,
    MaterialModule,
    InvoiceConfigurationModule,
    InvoiceDetailModule,
  ],
  exports: [FixedPriceInvoiceDetailComponent],
})
export class FixedPriceInvoiceDetailModule {}
