import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { Contract } from "@detalluz/api";
import { ContractsService } from "@detalluz/services";

@Component({
  selector: "dtl-contract-selector",
  templateUrl: "./contract-selector.component.html",
  styleUrls: ["./contract-selector.component.scss"],
})
export class ContractSelectorComponent implements OnInit {
  selectedContract?: Contract;
  private contracts: Contract[] = [];

  @Output() selected = new EventEmitter<Contract>();

  constructor(private contractsService: ContractsService) {}

  ngOnInit(): void {
    this.contractsService.getContracts().subscribe((contracts) => {
      this.contracts = contracts;

      if (this.contracts?.length > 0) {
        this.selectedContract = this.contracts[0];

        this.selected.emit(this.selectedContract);
      }
    });
  }
}
