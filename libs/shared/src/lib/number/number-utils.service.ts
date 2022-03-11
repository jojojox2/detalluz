import { Injectable } from "@angular/core";
import { DecimalPipe } from "@angular/common";

@Injectable({
  providedIn: "root",
})
export class NumberUtilsService {
  constructor(private decimalPipe: DecimalPipe) {}

  formatNumber(number: number | undefined, format: string = "1.1-2"): string {
    return this.decimalPipe.transform(number, format) ?? "-";
  }

  formatNumberWithUnit(
    number: number | undefined,
    unit: string,
    format: string = "1.0-2",
  ): string {
    return `${this.formatNumber(number, format)} ${unit}`;
  }

  roundNumber(number: number, digits = 2): number {
    const factor = Number(`1e${digits}`);
    return Math.round((number + Number.EPSILON) * factor) / factor;
  }
}
