import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PvpcInvoiceDetailComponent } from "./pvpc-invoice-detail.component";
import { MaterialModule } from "@detalluz/material";
import { InvoiceConfigurationModule } from "../../invoice-configuration/invoice-configuration.module";
import { InvoiceDetailModule } from "../invoice-detail.module";

@NgModule({
  declarations: [PvpcInvoiceDetailComponent],
  imports: [
    CommonModule,
    MaterialModule,
    InvoiceConfigurationModule,
    InvoiceDetailModule,
  ],
  exports: [PvpcInvoiceDetailComponent],
})
export class PvpcInvoiceDetailModule {}
