import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaterialModule } from "@detalluz/material";
import { DialogEntryComponent } from "./dialog-entry.component";

export { DialogEntryComponent } from "./dialog-entry.component";

@NgModule({
  declarations: [DialogEntryComponent],
  imports: [CommonModule, MaterialModule],
  exports: [DialogEntryComponent],
})
export class DialogEntryModule {}
