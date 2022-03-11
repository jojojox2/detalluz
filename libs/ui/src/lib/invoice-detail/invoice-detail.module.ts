import { NgModule } from "@angular/core";
import { CommonModule, DecimalPipe } from "@angular/common";
import { InvoiceDetailComponent } from "./invoice-detail.component";
import { MaterialModule } from "@detalluz/material";

export { InvoiceConcept } from "./invoice-detail.component";

@NgModule({
  declarations: [InvoiceDetailComponent],
  imports: [CommonModule, MaterialModule],
  exports: [InvoiceDetailComponent],
  providers: [DecimalPipe],
})
export class InvoiceDetailModule {}
