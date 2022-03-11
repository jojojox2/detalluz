import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaterialModule } from "@detalluz/material";
import { InfoComponent } from "./info.component";

@NgModule({
  declarations: [InfoComponent],
  imports: [CommonModule, MaterialModule],
  exports: [InfoComponent],
})
export class InfoModule {}
