import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DialogEntryComponent } from "@detalluz/ui";
import { HomepageComponent } from "./homepage/homepage.component";
import { InfoComponent } from "./info/info.component";
import { InvoiceSimulatorComponent } from "./invoice-simulator/invoice-simulator.component";

const routes: Routes = [
  {
    path: "login",
    component: DialogEntryComponent,
    outlet: "dialog",
  },
  {
    path: "invoice-simulator",
    component: InvoiceSimulatorComponent,
  },
  {
    path: "info",
    component: InfoComponent,
  },
  {
    path: "",
    component: HomepageComponent,
  },
  {
    path: "**",
    redirectTo: "/",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
