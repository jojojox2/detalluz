import { Component, Input, OnChanges } from "@angular/core";
import { LocalizeFn } from "@angular/localize/init";
import { Consumption, Configuration } from "@detalluz/api";
import { Defined } from "@detalluz/shared";
import { InvoiceConfiguration } from "../../invoice-configuration/invoice-configuration.component";
import { RangeSelectorForm } from "../../range-selector/range-selector.component";
import { InvoiceConcept } from "../invoice-detail.component";
import { InvoiceDetailService } from "../invoice-detail.service";

declare const $localize: LocalizeFn;

@Component({
  selector: "dtl-fixed-price-invoice-detail",
  templateUrl: "./fixed-price-invoice-detail.component.html",
  styleUrls: ["./fixed-price-invoice-detail.component.sass"],
})
export class FixedPriceInvoiceDetailComponent implements OnChanges {
  @Input() range: RangeSelectorForm = {};

  @Input() invoiceConfiguration: InvoiceConfiguration = {};

  @Input() consumption: Consumption | null = null;

  @Input() configuration: Configuration | null = null;

  concepts: InvoiceConcept[] | null = null;

  calculatedRange!: Defined<RangeSelectorForm>;

  constructor(private invoiceDetailService: InvoiceDetailService) {}

  ngOnChanges(): void {
    if (
      !this.range?.initDate ||
      !this.range?.endDate ||
      !this.invoiceConfiguration?.peakHiredPower ||
      !this.invoiceConfiguration?.valleyHiredPower
    ) {
      return;
    }

    if (!this.consumption || !this.configuration) {
      this.concepts = [];
      return;
    }

    this.calculatedRange = {
      initDate: this.range.initDate,
      endDate: this.range.endDate,
    };

    this.updateConcepts();
  }

  private updateConcepts() {
    const powerCosts: InvoiceConcept = this.calculatePowerCosts();

    const energyCosts: InvoiceConcept = this.calculateEnergyCosts();

    const subtotal: InvoiceConcept =
      this.invoiceDetailService.calculateSumConcept(
        [powerCosts, energyCosts],
        $localize`:@@fixed-price-invoice-detail.subtotal:Subtotal`,
        "subtotal",
      );

    const meterRental: InvoiceConcept =
      this.invoiceDetailService.calculateDailyCost(
        $localize`:@@fixed-price-invoice-detail.meter-rental:Meter rental`,
        this.calculatedRange,
        this.configuration?.meterRental,
      );

    const total: InvoiceConcept = this.invoiceDetailService.calculateSumConcept(
      [subtotal, meterRental],
      $localize`:@@fixed-price-invoice-detail.total-amount:Total amount`,
      "subtotal",
    );

    const vat: InvoiceConcept =
      this.invoiceDetailService.calculatePercentageConcept(
        [total],
        $localize`:@@fixed-price-invoice-detail.vat:VAT`,
        this.configuration?.vat,
        this.calculatedRange,
      );

    const invoiceTotalAmount: InvoiceConcept =
      this.invoiceDetailService.calculateSumConcept(
        [total, vat],
        $localize`:@@fixed-price-invoice-detail.invoice-total-amount:Invoice total amount`,
        "total",
      );

    this.concepts = [
      powerCosts,
      energyCosts,
      subtotal,
      meterRental,
      total,
      vat,
      invoiceTotalAmount,
    ];
  }

  private calculatePowerCosts(): InvoiceConcept {
    const concept: InvoiceConcept = {
      title: $localize`:@@fixed-price-invoice-detail.power-costs:Power costs`,
      subconcepts: [],
    };

    concept.subconcepts = concept.subconcepts?.concat(
      this.invoiceDetailService.calculatePowerCostsSubconceptsByPeriod(
        this.configuration?.fixedPrice?.powerCosts,
        $localize`:@@fixed-price-invoice-detail.hired-power-amount:Amount for hired power`,
        this.calculatedRange,
        this.invoiceConfiguration,
      ),
    );

    concept.value = this.invoiceDetailService.sumConceptsValues(
      concept.subconcepts,
    );

    return concept;
  }

  private calculateEnergyCosts(): InvoiceConcept {
    const concept: InvoiceConcept = {
      title: $localize`:@@fixed-price-invoice-detail.energy-costs:Energy costs`,
      subconcepts: [],
    };

    const periodConsumptionByDay =
      this.invoiceDetailService.calculateConsumptionByDay(
        this.consumption,
        this.configuration,
      );

    concept.subconcepts = concept.subconcepts?.concat(
      this.invoiceDetailService.calculateEnergyCostsSubconceptsByValue(
        this.configuration?.fixedPrice?.energyCosts,
        periodConsumptionByDay,
        $localize`:@@fixed-price-invoice-detail.consumed-energy-cost:Consumed energy cost`,
        this.calculatedRange,
      ),
    );

    concept.subconcepts = concept.subconcepts?.concat(
      this.invoiceDetailService.calculateEnergyCostsSubconceptsByValue(
        this.configuration?.communityElectricityTax,
        periodConsumptionByDay,
        $localize`:@@fixed-price-invoice-detail.community-electricity-tax:Minimum community electricity tax`,
        this.calculatedRange,
      ),
    );

    concept.value = this.invoiceDetailService.sumConceptsValues(
      concept.subconcepts,
    );

    return concept;
  }
}
