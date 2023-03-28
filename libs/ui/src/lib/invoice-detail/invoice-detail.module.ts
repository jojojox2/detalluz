import { NgModule } from "@angular/core";
import { CommonModule, DecimalPipe } from "@angular/common";
import { InvoiceDetailComponent } from "./invoice-detail.component";
import { MaterialModule } from "@detalluz/material";

export * from "./invoice-detail.model";

@NgModule({
  declarations: [InvoiceDetailComponent],
  imports: [CommonModule, MaterialModule],
  exports: [InvoiceDetailComponent],
  providers: [DecimalPipe],
})
export class InvoiceDetailModule {}
