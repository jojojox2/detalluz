import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { InvoiceConfigurationComponent } from "./invoice-configuration.component";
import { MaterialModule } from "@detalluz/material";
import { ReactiveFormsModule } from "@angular/forms";

export { InvoiceConfiguration } from "./invoice-configuration.component";

@NgModule({
  declarations: [InvoiceConfigurationComponent],
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  exports: [InvoiceConfigurationComponent],
})
export class InvoiceConfigurationModule {}
