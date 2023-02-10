import { Component, Input, OnChanges } from "@angular/core";
import { LocalizeFn } from "@angular/localize/init";
import { Prices, Consumption, Configuration, Charges } from "@detalluz/api";
import { Defined, NumberUtilsService } from "@detalluz/shared";
import { InvoiceConfiguration } from "../../invoice-configuration/invoice-configuration.component";
import { InvoiceConcept } from "../invoice-detail.module";
import { RangeSelectorForm } from "../../range-selector/range-selector.component";
import { InvoiceDetailService } from "../invoice-detail.service";

declare const $localize: LocalizeFn;

@Component({
  selector: "dtl-pvpc-invoice-detail",
  templateUrl: "./pvpc-invoice-detail.component.html",
  styleUrls: ["./pvpc-invoice-detail.component.scss"],
})
export class PvpcInvoiceDetailComponent implements OnChanges {
  @Input() range: RangeSelectorForm = {};

  @Input() invoiceConfiguration: InvoiceConfiguration = {};

  @Input() prices: Prices | null = null;

  @Input() charges: Charges | null = null;

  @Input() consumption: Consumption | null = null;

  @Input() configuration: Configuration | null = null;

  concepts: InvoiceConcept[] | null = null;

  calculatedRange!: Defined<RangeSelectorForm>;

  constructor(
    private invoiceDetailService: InvoiceDetailService,
    private numberUtilsService: NumberUtilsService,
  ) {}

  ngOnChanges(): void {
    if (
      !this.range?.initDate ||
      !this.range?.endDate ||
      !this.invoiceConfiguration?.peakHiredPower ||
      !this.invoiceConfiguration?.valleyHiredPower
    ) {
      return;
    }
    if (
      !this.prices ||
      !this.charges ||
      !this.consumption ||
      !this.configuration
    ) {
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

    const electricityTax: InvoiceConcept =
      this.invoiceDetailService.calculatePercentageConcept(
        [powerCosts, energyCosts],
        $localize`:@@pvpc-invoice-detail.electricity-tax:Electricity tax`,
        this.configuration?.electricityTax,
        this.calculatedRange,
      );

    const subtotal: InvoiceConcept =
      this.invoiceDetailService.calculateSumConcept(
        [powerCosts, energyCosts, electricityTax],
        $localize`:@@pvpc-invoice-detail.subtotal:Subtotal`,
        "subtotal",
      );

    const meterRental: InvoiceConcept =
      this.invoiceDetailService.calculateDailyCost(
        $localize`:@@pvpc-invoice-detail.meter-rental:Meter rental`,
        this.calculatedRange,
        this.configuration?.meterRental,
      );

    const total: InvoiceConcept = this.invoiceDetailService.calculateSumConcept(
      [subtotal, meterRental],
      $localize`:@@pvpc-invoice-detail.total-amount:Total amount`,
      "subtotal",
    );

    const vat: InvoiceConcept =
      this.invoiceDetailService.calculatePercentageConcept(
        [total],
        $localize`:@@pvpc-invoice-detail.vat:VAT`,
        this.configuration?.vat,
        this.calculatedRange,
      );

    const invoiceTotalAmount: InvoiceConcept =
      this.invoiceDetailService.calculateSumConcept(
        [total, vat],
        $localize`:@@pvpc-invoice-detail.invoice-total-amount:Invoice total amount`,
        "total",
      );

    this.concepts = [
      powerCosts,
      energyCosts,
      electricityTax,
      subtotal,
      meterRental,
      total,
      vat,
      invoiceTotalAmount,
    ];
  }

  private calculatePowerCosts(): InvoiceConcept {
    const concept: InvoiceConcept = {
      title: $localize`:@@pvpc-invoice-detail.power-costs:Power costs`,
      subconcepts: [],
    };

    concept.subconcepts = concept.subconcepts?.concat(
      this.invoiceDetailService.calculatePowerCostsSubconceptsByPeriod(
        this.configuration?.powerCosts.distributionTolls,
        $localize`:@@pvpc-invoice-detail.power-distribution-tolls:Distribution tolls`,
        this.calculatedRange,
        this.invoiceConfiguration,
      ),
    );
    concept.subconcepts = concept.subconcepts?.concat(
      this.invoiceDetailService.calculatePowerCostsSubconceptsByPeriod(
        this.configuration?.powerCosts.charges,
        $localize`:@@pvpc-invoice-detail.power-charges:Power charges`,
        this.calculatedRange,
        this.invoiceConfiguration,
      ),
    );
    concept.subconcepts = concept.subconcepts?.concat(
      this.invoiceDetailService.calculatePowerCostsSubconceptsByValue(
        this.configuration?.marketingMargin,
        $localize`:@@pvpc-invoice-detail.marketing-margin:Marketing margin`,
        this.calculatedRange,
        Math.max(
          this.invoiceConfiguration?.peakHiredPower ?? 0,
          this.invoiceConfiguration?.valleyHiredPower ?? 0,
        ),
      ),
    );

    concept.value = this.invoiceDetailService.sumConceptsValues(
      concept.subconcepts,
    );

    return concept;
  }

  private calculateEnergyCosts(): InvoiceConcept {
    const concept: InvoiceConcept = {
      title: $localize`:@@pvpc-invoice-detail.energy-costs:Energy costs`,
      subconcepts: [],
    };

    const periodConsumptionByDay =
      this.invoiceDetailService.calculateConsumptionByDay(
        this.consumption,
        this.configuration,
      );

    concept.subconcepts = concept.subconcepts?.concat(
      this.invoiceDetailService.calculateEnergyCostsSubconceptsByPeriod(
        this.configuration?.energyCosts.tolls,
        periodConsumptionByDay,
        $localize`:@@pvpc-invoice-detail.energy-tolls:Transport tolls and energy distribution`,
        this.calculatedRange,
      ),
    );
    concept.subconcepts = concept.subconcepts?.concat(
      this.invoiceDetailService.calculateEnergyCostsSubconceptsByPeriod(
        this.configuration?.energyCosts.charges,
        periodConsumptionByDay,
        $localize`:@@pvpc-invoice-detail.energy-charges:Energy charges`,
        this.calculatedRange,
      ),
    );
    concept.subconcepts?.push(
      this.calculateConsumedEnergyCostSubconcept(
        $localize`:@@pvpc-invoice-detail.consumed-energy-cost:Consumed energy cost`,
      ),
    );

    concept.value = this.invoiceDetailService.sumConceptsValues(
      concept.subconcepts,
    );

    return concept;
  }

  private calculateConsumedEnergyCostSubconcept(title: string): InvoiceConcept {
    const concept: InvoiceConcept = {
      title: title,
    };
    let cost = 0;

    this.consumption?.consumption?.forEach((consumptionEntry) => {
      const price =
        this.prices?.prices?.find(
          (priceEntry) => priceEntry.date === consumptionEntry.date,
        )?.value ?? 0;
      const charges =
        this.charges?.charges?.find(
          (chargesEntry) => chargesEntry.date === consumptionEntry.date,
        )?.value ?? 0;

      if (consumptionEntry.value && price) {
        cost += (consumptionEntry.value / 1000) * (price - charges);
      }
    });

    concept.value = this.numberUtilsService.roundNumber(cost);

    return concept;
  }
}
