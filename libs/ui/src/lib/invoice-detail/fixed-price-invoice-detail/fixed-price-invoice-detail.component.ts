import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from "@angular/core";
import { LocalizeFn } from "@angular/localize/init";
import { Consumption, Configuration } from "@detalluz/api";
import { Defined } from "@detalluz/shared";
import { InvoiceConfiguration } from "../../invoice-configuration/invoice-configuration.component";
import { RangeSelectorForm } from "../../range-selector/range-selector.component";
import { InvoiceConcept } from "../invoice-detail.model";
import { InvoiceDetailService } from "../invoice-detail.service";
import {
  FixedPriceEnergyCosts,
  FixedPriceInvoice,
  FixedPricePowerCosts,
} from "./fixed-price-invoice-detail.model";

declare const $localize: LocalizeFn;

@Component({
  selector: "dtl-fixed-price-invoice-detail",
  templateUrl: "./fixed-price-invoice-detail.component.html",
  styleUrls: ["./fixed-price-invoice-detail.component.scss"],
})
export class FixedPriceInvoiceDetailComponent implements OnChanges {
  @Input() range: RangeSelectorForm = {};

  @Input() invoiceConfiguration: InvoiceConfiguration = {};

  @Input() consumption: Consumption | null = null;

  @Input() configuration: Configuration | null = null;

  @Output() invoice = new EventEmitter<FixedPriceInvoice>();

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

    this.calculateInvoice();
  }

  private calculateInvoice(): void {
    const powerCosts = this.calculatePowerCosts();
    const energyCosts = this.calculateEnergyCosts();
    const subtotal = this.invoiceDetailService.calculateSum(
      [powerCosts, energyCosts],
      this.calculatedRange,
    );
    const meterRental = this.invoiceDetailService.calculateDailyCost(
      this.calculatedRange,
      this.configuration?.meterRental,
    );
    const total = this.invoiceDetailService.calculateSum(
      [subtotal, meterRental],
      this.calculatedRange,
    );
    const vat = this.invoiceDetailService.calculatePercentage(
      [total],
      this.configuration?.vat,
      this.calculatedRange,
    );

    const invoice: FixedPriceInvoice = {
      initDate: this.calculatedRange.initDate,
      endDate: this.calculatedRange.endDate,
      value: this.invoiceDetailService.sumValues([
        powerCosts,
        energyCosts,
        meterRental,
        vat,
      ]),

      powerCosts: powerCosts,
      energyCosts: energyCosts,
      subtotal: subtotal,
      meterRental: meterRental,
      total: total,
      vat: vat,
    };

    this.updateConcepts(invoice);
    this.invoice.emit(invoice);
  }

  private calculatePowerCosts(): FixedPricePowerCosts {
    const powerCosts: FixedPricePowerCosts = {
      initDate: this.calculatedRange.initDate,
      endDate: this.calculatedRange.endDate,

      hiredPower: this.invoiceDetailService.calculatePowerCostsByPeriod(
        this.configuration?.fixedPrice?.powerCosts,
        this.calculatedRange,
        this.invoiceConfiguration,
      ),
    };

    powerCosts.value = this.invoiceDetailService.sumValues([
      powerCosts.hiredPower,
    ]);

    return powerCosts;
  }

  private calculateEnergyCosts(): FixedPriceEnergyCosts {
    const periodConsumptionByDay =
      this.invoiceDetailService.calculateConsumptionByDay(
        this.consumption,
        this.configuration,
      );

    const energyCosts: FixedPriceEnergyCosts = {
      initDate: this.calculatedRange.initDate,
      endDate: this.calculatedRange.endDate,

      consumedEnergy: this.invoiceDetailService.calculateEnergyCostsByValue(
        this.configuration?.fixedPrice?.energyCosts,
        periodConsumptionByDay,
        this.calculatedRange,
      ),
      communityElectricityTax:
        this.invoiceDetailService.calculateEnergyCostsByValue(
          this.configuration?.communityElectricityTax,
          periodConsumptionByDay,
          this.calculatedRange,
        ),
    };

    energyCosts.value = this.invoiceDetailService.sumValues([
      energyCosts.consumedEnergy,
      energyCosts.communityElectricityTax,
    ]);

    return energyCosts;
  }

  private updateConcepts(invoice: FixedPriceInvoice) {
    const powerCosts: InvoiceConcept = this.calculatePowerCostsConcept(invoice);

    const energyCosts: InvoiceConcept =
      this.calculateEnergyCostsConcept(invoice);

    const subtotal: InvoiceConcept =
      this.invoiceDetailService.buildInvoiceConcept(
        $localize`:@@fixed-price-invoice-detail.subtotal:Subtotal`,
        invoice.subtotal,
        undefined,
        undefined,
        "subtotal",
      );

    const meterRental: InvoiceConcept =
      this.invoiceDetailService.buildInvoiceConcept(
        $localize`:@@fixed-price-invoice-detail.meter-rental:Meter rental`,
        invoice.meterRental,
      );

    const total: InvoiceConcept = this.invoiceDetailService.buildInvoiceConcept(
      $localize`:@@fixed-price-invoice-detail.total-amount:Total amount`,
      invoice.total,
      undefined,
      undefined,
      "subtotal",
    );

    const vat: InvoiceConcept = this.invoiceDetailService.buildInvoiceConcept(
      $localize`:@@fixed-price-invoice-detail.vat:VAT`,
      invoice.vat,
    );

    const invoiceTotalAmount: InvoiceConcept =
      this.invoiceDetailService.buildInvoiceConcept(
        $localize`:@@fixed-price-invoice-detail.invoice-total-amount:Invoice total amount`,
        invoice,
        undefined,
        undefined,
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

  private calculatePowerCostsConcept(
    invoice: FixedPriceInvoice,
  ): InvoiceConcept {
    const concept: InvoiceConcept = {
      title: $localize`:@@fixed-price-invoice-detail.power-costs:Power costs`,
      value: invoice.powerCosts.value,
      subconcepts: [],
    };

    concept.subconcepts = concept.subconcepts?.concat(
      invoice.powerCosts.hiredPower.ranges.map(
        (invoicePeriodEntry, index, array) =>
          this.invoiceDetailService.buildInvoiceConcept(
            $localize`:@@fixed-price-invoice-detail.hired-power-amount:Amount for hired power`,
            invoicePeriodEntry,
            array,
            this.invoiceDetailService.powerSubconceptsTitles,
          ),
      ),
    );

    return concept;
  }

  private calculateEnergyCostsConcept(
    invoice: FixedPriceInvoice,
  ): InvoiceConcept {
    const concept: InvoiceConcept = {
      title: $localize`:@@fixed-price-invoice-detail.energy-costs:Energy costs`,
      value: invoice.energyCosts.value,
      subconcepts: [],
    };

    concept.subconcepts = concept.subconcepts?.concat(
      invoice.energyCosts.consumedEnergy.ranges.map(
        (invoiceEntry, index, array) =>
          this.invoiceDetailService.buildInvoiceConcept(
            $localize`:@@fixed-price-invoice-detail.consumed-energy-cost:Consumed energy cost`,
            invoiceEntry,
            array,
          ),
      ),
    );

    concept.subconcepts = concept.subconcepts?.concat(
      invoice.energyCosts.communityElectricityTax.ranges.map(
        (invoiceEntry, index, array) =>
          this.invoiceDetailService.buildInvoiceConcept(
            $localize`:@@fixed-price-invoice-detail.community-electricity-tax:Minimum community electricity tax`,
            invoiceEntry,
            array,
          ),
      ),
    );

    return concept;
  }
}
