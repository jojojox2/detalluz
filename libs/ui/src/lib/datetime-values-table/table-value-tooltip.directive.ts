import { DecimalPipe } from "@angular/common";
import { Directive, Host, Input } from "@angular/core";
import { MatTooltip } from "@angular/material/tooltip";

@Directive({ selector: "[dtlTableValueTooltip]" })
export class ExtendedMatTooltipDirective extends MatTooltip {}

@Directive({
  selector: "[dtlTableValueTooltip]",
  providers: [DecimalPipe],
})
export class TableValueTooltipDirective {
  private value!: string | number | null | undefined;
  private unit!: string | null | undefined;
  private format: string | undefined = "1.2-5";

  @Input() set dtlTableValueTooltip(value: string | number | null | undefined) {
    this.value = value;
    this.setMessage();
  }

  @Input() set dtlTableValueTooltipDelay(
    value: string | number | null | undefined,
  ) {
    this.matTooltip.showDelay = Number(value);
  }

  @Input() set dtlTableValueTooltipUnit(value: string | null | undefined) {
    this.unit = value;
    this.setMessage();
  }

  @Input() set dtlTableValueTooltipFormat(value: string | undefined) {
    this.format = value;
    this.setMessage();
  }

  constructor(
    @Host() public matTooltip: ExtendedMatTooltipDirective,
    private decimalPipe: DecimalPipe,
  ) {
    this.matTooltip.message = "";
    this.matTooltip.showDelay = 500;
  }

  private setMessage(): void {
    const displayNumber = this.decimalPipe.transform(this.value, this.format);
    this.matTooltip.message = displayNumber
      ? `${displayNumber} ${this.unit || ""}`.trim()
      : "";
  }
}
