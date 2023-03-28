import { NestedTreeControl } from "@angular/cdk/tree";
import { DecimalPipe } from "@angular/common";
import { Component, Input, OnChanges } from "@angular/core";
import { LocalizeFn } from "@angular/localize/init";
import { matExpansionAnimations } from "@angular/material/expansion";
import { MatTreeNestedDataSource } from "@angular/material/tree";
import { RangeSelectorForm } from "../range-selector/range-selector.component";
import { InvoiceConcept } from "./invoice-detail.model";

declare const $localize: LocalizeFn;

@Component({
  selector: "dtl-invoice-detail",
  templateUrl: "./invoice-detail.component.html",
  styleUrls: ["./invoice-detail.component.scss"],
  providers: [DecimalPipe],
  animations: [matExpansionAnimations.bodyExpansion],
})
export class InvoiceDetailComponent implements OnChanges {
  @Input() title: string = $localize`:@@invoice-detail.title:Invoice detail`;

  @Input() range: RangeSelectorForm | null = null;

  @Input() concepts: InvoiceConcept[] | null = null;

  treeControl = new NestedTreeControl<InvoiceConcept>(
    (node) => node.subconcepts,
  );
  dataSource = new MatTreeNestedDataSource<InvoiceConcept>();

  invoiceDays = 0;

  ngOnChanges(): void {
    if (!this.concepts || this.concepts.length === 0) {
      this.dataSource.data = [];
      return;
    }

    if (this.range && this.range.initDate && this.range.endDate) {
      this.invoiceDays =
        this.range.endDate.diff(this.range.initDate, "day") + 1;
    }

    this.dataSource.data = this.concepts;
  }

  hasChild(_: number, node: InvoiceConcept): boolean {
    return !!node.subconcepts && node.subconcepts.length > 0;
  }
}
