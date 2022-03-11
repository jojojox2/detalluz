import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaterialModule } from "@detalluz/material";
import { RangeSelectorComponent } from "./range-selector.component";
import { ReactiveFormsModule } from "@angular/forms";

export { RangeSelectorForm } from "./range-selector.component";

@NgModule({
  declarations: [RangeSelectorComponent],
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  exports: [RangeSelectorComponent],
})
export class RangeSelectorModule {}
