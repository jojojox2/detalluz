import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaterialModule } from "@detalluz/material";
import { HomepageComponent } from "./homepage.component";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DatetimeValuesTableModule, RangeSelectorModule } from "@detalluz/ui";

@NgModule({
  declarations: [HomepageComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule,
    DatetimeValuesTableModule,
    RangeSelectorModule,
  ],
  exports: [HomepageComponent],
})
export class HomepageModule {}
