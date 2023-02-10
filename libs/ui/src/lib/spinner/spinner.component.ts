import { Component } from "@angular/core";
import { SpinnerService } from "./spinner.service";

@Component({
  selector: "dtl-spinner",
  templateUrl: "./spinner.component.html",
  styleUrls: ["./spinner.component.scss"],
})
export class SpinnerComponent {
  showSpinner = false;

  constructor(private spinnerService: SpinnerService) {
    this.spinnerService
      .watch()
      .subscribe((status) => (this.showSpinner = status));
  }
}
