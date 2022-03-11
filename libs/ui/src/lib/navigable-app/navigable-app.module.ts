import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaterialModule } from "@detalluz/material";
import { RouterModule } from "@angular/router";
import { NavigableAppComponent } from "./navigable-app.component";
import { SidenavModule } from "../sidenav/sidenav.module";
import { ToolbarModule } from "../toolbar/toolbar.module";

@NgModule({
  declarations: [NavigableAppComponent],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    ToolbarModule,
    SidenavModule,
  ],
  exports: [NavigableAppComponent],
})
export class NavigableAppModule {}
