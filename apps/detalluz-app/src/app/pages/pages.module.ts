import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaterialModule } from "@detalluz/material";
import { HomepageModule } from "./homepage/homepage.module";
import { PagesRoutingModule } from "./pages-routing.module";
import { ReactiveFormsModule } from "@angular/forms";
import { InfoModule } from "./info/info.module";
import { InvoiceSimulatorModule } from "./invoice-simulator/invoice-simulator.module";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    PagesRoutingModule,
    HomepageModule,
    InfoModule,
    InvoiceSimulatorModule,
  ],
  exports: [PagesRoutingModule],
})
export class PagesModule {}
