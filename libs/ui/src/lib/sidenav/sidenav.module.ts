import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SidenavComponent } from "./sidenav.component";
import { MaterialModule } from "@detalluz/material";
import { RouterModule } from "@angular/router";

export { SidenavItem } from "./sidenav.component";

@NgModule({
  declarations: [SidenavComponent],
  imports: [CommonModule, MaterialModule, RouterModule],
  exports: [SidenavComponent],
})
export class SidenavModule {}
