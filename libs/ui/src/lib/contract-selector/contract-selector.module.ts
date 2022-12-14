import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ContractSelectorComponent } from "./contract-selector.component";

@NgModule({
  declarations: [ContractSelectorComponent],
  imports: [CommonModule],
  exports: [ContractSelectorComponent],
})
export class ContractSelectorModule {}
