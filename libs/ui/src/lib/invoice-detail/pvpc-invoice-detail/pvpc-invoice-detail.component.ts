import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from "@angular/core";
import { LocalizeFn } from "@angular/localize/init";
import { Prices, Consumption, Configuration, Charges } from "@detalluz/api";
import { Defined, NumberUtilsService } from "@detalluz/shared";
import { InvoiceConfiguration } from "../../invoice-configuration/invoice-configuration.component";
import { RangeSelectorForm } from "../../range-selector/range-selector.component";
import { InvoiceDetailService } from "../invoice-detail.service";
import {
  PVPCEnergyCosts,
  PVPCInvoice,
  PVPCPowerCosts,
} from "./pvpc-invoice-detail.model";
import { InvoiceConcept, InvoiceEntry } from "../invoice-detail.model";

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

  @Output() invoice = new EventEmitter<PVPCInvoice>();

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

    this.calculateInvoice();
  }

  private calculateInvoice(): void {
    const powerCosts = this.calculatePowerCosts();
    const energyCosts = this.calculateEnergyCosts();
    const electricityTax = this.invoiceDetailService.calculatePercentage(
      [powerCosts, energyCosts],
      this.configuration?.electricityTax,
      this.calculatedRange,
    );
    const subtotal = this.invoiceDetailService.calculateSum(
      [powerCosts, energyCosts, electricityTax],
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

    const invoice: PVPCInvoice = {
      initDate: this.calculatedRange.initDate,
      endDate: this.calculatedRange.endDate,
      value: this.invoiceDetailService.sumValues([
        powerCosts,
        energyCosts,
        electricityTax,
        meterRental,
        vat,
      ]),

      powerCosts: powerCosts,
      energyCosts: energyCosts,
      electricityTax: electricityTax,
      subtotal: subtotal,
      meterRental: meterRental,
      total: total,
      vat: vat,
    };

    this.updateConcepts(invoice);
    this.invoice.emit(invoice);
  }

  private calculatePowerCosts(): PVPCPowerCosts {
    const powerCosts: PVPCPowerCosts = {
      initDate: this.calculatedRange.initDate,
      endDate: this.calculatedRange.endDate,

      distributionTolls: this.invoiceDetailService.calculatePowerCostsByPeriod(
        this.configuration?.powerCosts.distributionTolls,
        this.calculatedRange,
        this.invoiceConfiguration,
      ),
      charges: this.invoiceDetailService.calculatePowerCostsByPeriod(
        this.configuration?.powerCosts.charges,
        this.calculatedRange,
        this.invoiceConfiguration,
      ),
      marketingMargin: this.invoiceDetailService.calculatePowerCostsByValue(
        this.configuration?.marketingMargin,
        this.calculatedRange,
        Math.max(
          this.invoiceConfiguration?.peakHiredPower ?? 0,
          this.invoiceConfiguration?.valleyHiredPower ?? 0,
        ),
      ),
    };

    powerCosts.value = this.invoiceDetailService.sumValues([
      powerCosts.distributionTolls,
      powerCosts.charges,
      powerCosts.marketingMargin,
    ]);

    return powerCosts;
  }

  private calculateEnergyCosts(): PVPCEnergyCosts {
    const periodConsumptionByDay =
      this.invoiceDetailService.calculateConsumptionByDay(
        this.consumption,
        this.configuration,
      );

    const energyCosts: PVPCEnergyCosts = {
      initDate: this.calculatedRange.initDate,
      endDate: this.calculatedRange.endDate,

      tolls: this.invoiceDetailService.calculateEnergyCostsByPeriod(
        this.configuration?.energyCosts.tolls,
        periodConsumptionByDay,
        this.calculatedRange,
      ),
      charges: this.invoiceDetailService.calculateEnergyCostsByPeriod(
        this.configuration?.energyCosts.charges,
        periodConsumptionByDay,
        this.calculatedRange,
      ),
      consumedEnergy: this.calculateConsumedEnergyCost(),
    };

    energyCosts.value = this.invoiceDetailService.sumValues([
      energyCosts.tolls,
      energyCosts.charges,
      energyCosts.consumedEnergy,
    ]);

    return energyCosts;
  }

  private calculateConsumedEnergyCost(): InvoiceEntry {
    const entry: InvoiceEntry = {
      initDate: this.calculatedRange.initDate,
      endDate: this.calculatedRange.endDate,
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

    entry.value = this.numberUtilsService.roundNumber(cost);

    return entry;
  }

  private updateConcepts(invoice: PVPCInvoice) {
    const powerCosts: InvoiceConcept = this.calculatePowerCostsConcept(invoice);

    const energyCosts: InvoiceConcept =
      this.calculateEnergyCostsConcept(invoice);

    const electricityTax: InvoiceConcept =
      this.invoiceDetailService.buildInvoiceConcept(
        $localize`:@@pvpc-invoice-detail.electricity-tax:Electricity tax`,
        invoice.electricityTax,
      );

    const subtotal: InvoiceConcept =
      this.invoiceDetailService.buildInvoiceConcept(
        $localize`:@@pvpc-invoice-detail.subtotal:Subtotal`,
        invoice.subtotal,
        undefined,
        undefined,
        "subtotal",
      );

    const meterRental: InvoiceConcept =
      this.invoiceDetailService.buildInvoiceConcept(
        $localize`:@@pvpc-invoice-detail.meter-rental:Meter rental`,
        invoice.meterRental,
      );

    const total: InvoiceConcept = this.invoiceDetailService.buildInvoiceConcept(
      $localize`:@@pvpc-invoice-detail.total-amount:Total amount`,
      invoice.total,
      undefined,
      undefined,
      "subtotal",
    );

    const vat: InvoiceConcept = this.invoiceDetailService.buildInvoiceConcept(
      $localize`:@@pvpc-invoice-detail.vat:VAT`,
      invoice.vat,
    );

    const invoiceTotalAmount: InvoiceConcept =
      this.invoiceDetailService.buildInvoiceConcept(
        $localize`:@@pvpc-invoice-detail.invoice-total-amount:Invoice total amount`,
        invoice,
        undefined,
        undefined,
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

  private calculatePowerCostsConcept(invoice: PVPCInvoice): InvoiceConcept {
    const concept: InvoiceConcept = {
      title: $localize`:@@pvpc-invoice-detail.power-costs:Power costs`,
      value: invoice.powerCosts.value,
      subconcepts: [],
    };

    concept.subconcepts = concept.subconcepts?.concat(
      invoice.powerCosts.distributionTolls.ranges.map(
        (invoicePeriodEntry, index, array) =>
          this.invoiceDetailService.buildInvoiceConcept(
            $localize`:@@pvpc-invoice-detail.power-distribution-tolls:Distribution tolls`,
            invoicePeriodEntry,
            array,
            this.invoiceDetailService.powerSubconceptsTitles,
          ),
      ),
    );

    concept.subconcepts = concept.subconcepts?.concat(
      invoice.powerCosts.charges.ranges.map(
        (invoicePeriodEntry, index, array) =>
          this.invoiceDetailService.buildInvoiceConcept(
            $localize`:@@pvpc-invoice-detail.power-charges:Power charges`,
            invoicePeriodEntry,
            array,
            this.invoiceDetailService.powerSubconceptsTitles,
          ),
      ),
    );

    concept.subconcepts = concept.subconcepts?.concat(
      invoice.powerCosts.marketingMargin.ranges.map((entry, index, array) =>
        this.invoiceDetailService.buildInvoiceConcept(
          $localize`:@@pvpc-invoice-detail.marketing-margin:Marketing margin`,
          entry,
          array,
        ),
      ),
    );

    return concept;
  }

  private calculateEnergyCostsConcept(invoice: PVPCInvoice): InvoiceConcept {
    const concept: InvoiceConcept = {
      title: $localize`:@@pvpc-invoice-detail.energy-costs:Energy costs`,
      value: invoice.energyCosts.value,
      subconcepts: [],
    };

    concept.subconcepts = concept.subconcepts?.concat(
      invoice.energyCosts.tolls.ranges.map((invoicePeriodEntry, index, array) =>
        this.invoiceDetailService.buildInvoiceConcept(
          $localize`:@@pvpc-invoice-detail.energy-tolls:Transport tolls and energy distribution`,
          invoicePeriodEntry,
          array,
          this.invoiceDetailService.energySubconceptsTitles,
        ),
      ),
    );

    concept.subconcepts = concept.subconcepts?.concat(
      invoice.energyCosts.charges.ranges.map(
        (invoicePeriodEntry, index, array) =>
          this.invoiceDetailService.buildInvoiceConcept(
            $localize`:@@pvpc-invoice-detail.energy-charges:Energy charges`,
            invoicePeriodEntry,
            array,
            this.invoiceDetailService.energySubconceptsTitles,
          ),
      ),
    );

    concept.subconcepts = concept.subconcepts?.concat(
      [invoice.energyCosts.consumedEnergy].map((entry) =>
        this.invoiceDetailService.buildInvoiceConcept(
          $localize`:@@pvpc-invoice-detail.consumed-energy-cost:Consumed energy cost`,
          entry,
        ),
      ),
    );

    return concept;
  }
}
