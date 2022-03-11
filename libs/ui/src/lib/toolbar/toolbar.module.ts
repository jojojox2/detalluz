import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaterialModule } from "@detalluz/material";
import { ToolbarComponent } from "./toolbar.component";

export { Language } from "./toolbar.component";

@NgModule({
  declarations: [ToolbarComponent],
  imports: [CommonModule, MaterialModule],
  exports: [ToolbarComponent],
})
export class ToolbarModule {}
