import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaterialModule } from "@detalluz/material";
import { SpinnerComponent } from "./spinner.component";

export { SpinnerInterceptor } from "./spinner.interceptor";
export { SpinnerService } from "./spinner.service";

@NgModule({
  declarations: [SpinnerComponent],
  imports: [CommonModule, MaterialModule],
  exports: [SpinnerComponent],
})
export class SpinnerModule {}
