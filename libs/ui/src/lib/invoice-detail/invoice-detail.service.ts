import { Injectable } from "@angular/core";
import {
  TemporalPeriodConfiguration,
  TemporalConfiguration,
  Period,
  Consumption,
  Configuration,
  TemporalConfigurationValue,
} from "@detalluz/api";
import {
  DateFormats,
  DayjsService,
  Defined,
  NumberUtilsService,
} from "@detalluz/shared";
import { Dayjs } from "dayjs";
import { InvoiceConfiguration } from "../invoice-configuration/invoice-configuration.component";
import { RangeSelectorForm } from "../range-selector/range-selector.component";
import {
  InvoiceConcept,
  InvoiceEntry,
  InvoicePeriodEntry,
  InvoiceRangedEntry,
} from "./invoice-detail.model";

@Injectable({
  providedIn: "root",
})
export class InvoiceDetailService {
  constructor(
    private dayjsService: DayjsService,
    private numberUtilsService: NumberUtilsService,
  ) {}

  calculatePowerCostsByPeriod(
    config: TemporalPeriodConfiguration[] | undefined,
    range: Defined<RangeSelectorForm>,
    invoiceConfiguration: InvoiceConfiguration,
  ): InvoiceRangedEntry<InvoicePeriodEntry> {
    const invoiceRangedEntry: InvoiceRangedEntry<InvoicePeriodEntry> = {
      initDate: range.initDate,
      endDate: range.endDate,
      ranges: [],
    };

    const temporalConfigurations = this.getAppliedTemporalConfiguration(
      config,
      range.initDate,
      range.endDate,
    );

    temporalConfigurations.forEach((tempConfig) => {
      const validFrom = this.dayjsService.parse(tempConfig.validFrom);
      const validUntil = this.dayjsService.parse(tempConfig.validUntil);
      const initDate =
        validFrom && validFrom.diff(range.initDate, "day") > 0
          ? validFrom
          : range.initDate;
      const endDate =
        validUntil && validUntil.diff(range.endDate, "day") < 0
          ? validUntil
          : range.endDate;

      const invoicePeriodEntry: InvoicePeriodEntry = {
        initDate: initDate,
        endDate: endDate,
      };

      if (tempConfig.value.P1) {
        invoicePeriodEntry.P1 = this.calculatePowerPeriod(
          invoiceConfiguration?.peakHiredPower ?? 0,
          tempConfig.value.P1,
          initDate,
          endDate,
        );
      }

      if (tempConfig.value.P2) {
        invoicePeriodEntry.P2 = this.calculatePowerPeriod(
          invoiceConfiguration?.valleyHiredPower ?? 0,
          tempConfig.value.P2,
          initDate,
          endDate,
        );
      }

      invoicePeriodEntry.value = this.sumValues(invoicePeriodEntry);

      invoiceRangedEntry.ranges.push(invoicePeriodEntry);
      invoiceRangedEntry.value = this.sumValues([
        invoiceRangedEntry,
        invoicePeriodEntry,
      ]);
    });

    return invoiceRangedEntry;
  }

  calculatePowerCostsByValue(
    config: TemporalConfigurationValue[] | undefined,
    range: Defined<RangeSelectorForm>,
    hiredPower: number,
  ): InvoiceRangedEntry<InvoiceEntry> {
    const invoiceRangedEntry: InvoiceRangedEntry<InvoiceEntry> = {
      initDate: range.initDate,
      endDate: range.endDate,
      ranges: [],
    };

    const temporalConfigurations = this.getAppliedTemporalConfiguration(
      config,
      range.initDate,
      range.endDate,
    );

    temporalConfigurations.forEach((tempConfig) => {
      const validFrom = this.dayjsService.parse(tempConfig.validFrom);
      const validUntil = this.dayjsService.parse(tempConfig.validUntil);
      const initDate =
        validFrom && validFrom.diff(range.initDate, "day") > 0
          ? validFrom
          : range.initDate;
      const endDate =
        validUntil && validUntil.diff(range.endDate, "day") < 0
          ? validUntil
          : range.endDate;

      const entry = this.calculatePowerPeriod(
        hiredPower,
        tempConfig.value,
        initDate,
        endDate,
      );

      invoiceRangedEntry.ranges.push(entry);
      invoiceRangedEntry.value = this.sumValues([invoiceRangedEntry, entry]);
    });

    return invoiceRangedEntry;
  }

  calculateEnergyCostsByPeriod(
    config: TemporalPeriodConfiguration[] | undefined,
    consumptionByDay: Record<string, Record<Period, number>>,
    range: Defined<RangeSelectorForm>,
  ): InvoiceRangedEntry<InvoicePeriodEntry> {
    const invoiceRangedEntry: InvoiceRangedEntry<InvoicePeriodEntry> = {
      initDate: range.initDate,
      endDate: range.endDate,
      ranges: [],
    };

    const temporalConfigurations = this.getAppliedTemporalConfiguration(
      config,
      range.initDate,
      range.endDate,
    );

    temporalConfigurations.forEach((tempConfig) => {
      const validFrom = this.dayjsService.parse(tempConfig.validFrom);
      const validUntil = this.dayjsService.parse(tempConfig.validUntil);
      const initDate =
        validFrom && validFrom.diff(range.initDate, "day") > 0
          ? validFrom
          : range.initDate;
      const endDate =
        validUntil && validUntil.diff(range.endDate, "day") < 0
          ? validUntil
          : range.endDate;

      const invoicePeriodEntry: InvoicePeriodEntry = {
        initDate: initDate,
        endDate: endDate,
      };

      const consumptionInPeriod: Record<Period, number> = {
        P1: 0,
        P2: 0,
        P3: 0,
      };

      const initDateDay = this.dayjsService.format(
        initDate,
        DateFormats.NUMBERED_DAY,
      );
      const endDateDay = this.dayjsService.format(
        endDate,
        DateFormats.NUMBERED_DAY,
      );
      Object.entries(consumptionByDay).forEach(([dateDay, dateConsumption]) => {
        if (dateDay >= initDateDay && dateDay <= endDateDay) {
          consumptionInPeriod.P1 += dateConsumption.P1;
          consumptionInPeriod.P2 += dateConsumption.P2;
          consumptionInPeriod.P3 += dateConsumption.P3;
        }
      });

      (<Period[]>Object.keys(consumptionInPeriod)).forEach(
        (period: Period) =>
          (consumptionInPeriod[period] = this.numberUtilsService.roundNumber(
            consumptionInPeriod[period] / 1000,
            0,
          )),
      );

      if (tempConfig.value.P1) {
        invoicePeriodEntry.P1 = this.calculateEnergyPeriod(
          consumptionInPeriod.P1,
          tempConfig.value.P1,
          initDate,
          endDate,
        );
      }

      if (tempConfig.value.P2) {
        invoicePeriodEntry.P2 = this.calculateEnergyPeriod(
          consumptionInPeriod.P2,
          tempConfig.value.P2,
          initDate,
          endDate,
        );
      }

      if (tempConfig.value.P3) {
        invoicePeriodEntry.P3 = this.calculateEnergyPeriod(
          consumptionInPeriod.P3,
          tempConfig.value.P3,
          initDate,
          endDate,
        );
      }

      invoicePeriodEntry.value = this.sumValues(invoicePeriodEntry);

      invoiceRangedEntry.ranges.push(invoicePeriodEntry);
      invoiceRangedEntry.value = this.sumValues([
        invoiceRangedEntry,
        invoicePeriodEntry,
      ]);
    });

    return invoiceRangedEntry;
  }

  calculateEnergyCostsByValue(
    config: TemporalConfigurationValue[] | undefined,
    consumptionByDay: Record<string, Record<Period, number>>,
    range: Defined<RangeSelectorForm>,
  ): InvoiceRangedEntry<InvoiceEntry> {
    const invoiceRangedEntry: InvoiceRangedEntry<InvoiceEntry> = {
      initDate: range.initDate,
      endDate: range.endDate,
      ranges: [],
    };

    const temporalConfigurations = this.getAppliedTemporalConfiguration(
      config,
      range.initDate,
      range.endDate,
    );

    temporalConfigurations.forEach((tempConfig) => {
      const validFrom = this.dayjsService.parse(tempConfig.validFrom);
      const validUntil = this.dayjsService.parse(tempConfig.validUntil);
      const initDate =
        validFrom && validFrom.diff(range.initDate, "day") > 0
          ? validFrom
          : range.initDate;
      const endDate =
        validUntil && validUntil.diff(range.endDate, "day") < 0
          ? validUntil
          : range.endDate;

      let consumptionInPeriod = 0;

      const initDateDay = this.dayjsService.format(
        initDate,
        DateFormats.NUMBERED_DAY,
      );
      const endDateDay = this.dayjsService.format(
        endDate,
        DateFormats.NUMBERED_DAY,
      );
      Object.entries(consumptionByDay).forEach(([dateDay, dateConsumption]) => {
        if (dateDay >= initDateDay && dateDay <= endDateDay) {
          consumptionInPeriod +=
            dateConsumption.P1 + dateConsumption.P2 + dateConsumption.P3;
        }
      });

      consumptionInPeriod = this.numberUtilsService.roundNumber(
        consumptionInPeriod / 1000,
        0,
      );

      invoiceRangedEntry.ranges.push(
        this.calculateEnergyPeriod(
          consumptionInPeriod,
          tempConfig.value,
          initDate,
          endDate,
        ),
      );
    });

    invoiceRangedEntry.value = this.sumValues(invoiceRangedEntry.ranges);

    return invoiceRangedEntry;
  }

  calculateSum(
    concepts: (InvoicePeriodEntry | InvoiceEntry)[],
    range: Defined<RangeSelectorForm>,
  ): InvoiceEntry {
    return {
      initDate: range.initDate,
      endDate: range.endDate,
      value: this.sumValues(concepts),
    };
  }

  calculatePercentage(
    concepts: (InvoicePeriodEntry | InvoiceEntry)[],
    config: TemporalConfigurationValue[] | undefined,
    range: Defined<RangeSelectorForm>,
  ): InvoiceEntry {
    const taxValue =
      this.getCurrentTemporalConfiguration(range, config)?.value ?? 0;
    const baseValue = this.sumValues(concepts) ?? 0;

    const value = this.numberUtilsService.roundNumber(
      baseValue * (taxValue / 100),
    );

    return {
      initDate: range.initDate,
      endDate: range.endDate,
      calculationDetail: `${this.numberUtilsService.formatNumberWithUnit(
        baseValue,
        "€",
        "1.2-2",
      )} x ${this.numberUtilsService.formatNumberWithUnit(
        taxValue,
        "%",
        "1.0-5",
      )}`,
      value: value,
    };
  }

  calculateDailyCost(
    range: Defined<RangeSelectorForm>,
    config: TemporalConfigurationValue[] | undefined,
  ): InvoiceEntry {
    const dailyCost =
      this.getCurrentTemporalConfiguration(range, config)?.value ?? 0;
    const days = range.endDate.diff(range.initDate, "day") + 1;

    const value = this.numberUtilsService.roundNumber(dailyCost * days);

    return {
      initDate: range.initDate,
      endDate: range.endDate,
      calculationDetail: `${this.numberUtilsService.formatNumberWithUnit(
        dailyCost,
        "€/" + $localize`:@@invoice-detail.day:day`,
        "1.2-5",
      )} x ${this.numberUtilsService.formatNumberWithUnit(
        days,
        $localize`:@@invoice-detail.days:days`,
      )}`,
      value: value,
    };
  }

  /**
   * Returns consumption in each time period for each day
   * @returns Object with day as key (format YYYYMMDD) and sumed consumption for each period (P1, P2, P3)
   */
  calculateConsumptionByDay(
    consumption: Consumption | null,
    configuration: Configuration | null,
  ): Record<string, Record<Period, number>> {
    const consumptions: Record<string, Record<Period, number>> = {};

    consumption?.consumption?.forEach((hourlyItem) => {
      if (
        !hourlyItem.date ||
        hourlyItem.date.length < 13 ||
        !hourlyItem.value
      ) {
        return;
      }

      const year = hourlyItem.date.substring(0, 4);
      const month = hourlyItem.date.substring(5, 7);
      const day = hourlyItem.date.substring(8, 10);
      const hour = Number(hourlyItem.date.substring(11, 13));

      const date = year + month + day;
      let period: Period = "P2";
      if (hour >= 0 && hour < 8) {
        period = "P3";
      } else if ((hour >= 10 && hour < 14) || (hour >= 18 && hour < 22)) {
        period = "P1";
      }

      let consumption: Record<Period, number> = consumptions[date];
      if (!consumption) {
        consumption = {
          P1: 0,
          P2: 0,
          P3: 0,
        };
        consumptions[date] = consumption;
      }
      consumption[period] += hourlyItem.value;
    });

    Object.entries(consumptions).forEach(([date, consumption]) => {
      const dayjsDate = this.dayjsService.parse(date, DateFormats.NUMBERED_DAY);
      if (!dayjsDate) {
        return;
      }
      const dayOfWeek = dayjsDate.day();
      if (
        dayOfWeek === 0 ||
        dayOfWeek === 6 ||
        this.isHoliday(dayjsDate, configuration)
      ) {
        consumption.P3 += consumption.P1 + consumption.P2;
        consumption.P2 = 0;
        consumption.P1 = 0;
      }
    });

    return consumptions;
  }

  sumValues(
    entries:
      | InvoicePeriodEntry
      | InvoiceEntry
      | (InvoicePeriodEntry | InvoiceEntry)[],
  ): number | undefined {
    const entriesArray = Array.isArray(entries) ? entries : [entries];

    return entriesArray?.reduce(
      (value, entry) =>
        this.isInvoicePeriodEntry(entry)
          ? (this.sumInvoicePeriodEntryValues(entry) ?? 0) + value
          : entry?.value
          ? value + entry.value
          : value,
      0,
    );
  }

  private sumInvoicePeriodEntryValues(
    invoicePeriodEntry: InvoicePeriodEntry,
  ): number | undefined {
    return [
      invoicePeriodEntry?.P1,
      invoicePeriodEntry?.P2,
      invoicePeriodEntry?.P3,
    ].reduce((value, entry) => (entry?.value ? value + entry.value : value), 0);
  }

  isInvoicePeriodEntry(
    invoicePeriodEntry: InvoicePeriodEntry | InvoiceEntry,
  ): invoicePeriodEntry is InvoicePeriodEntry {
    return (
      (invoicePeriodEntry as InvoicePeriodEntry).P1 !== undefined ||
      (invoicePeriodEntry as InvoicePeriodEntry).P2 !== undefined ||
      (invoicePeriodEntry as InvoicePeriodEntry).P3 !== undefined
    );
  }

  private getAppliedTemporalConfiguration<T extends TemporalConfiguration>(
    config?: T[],
    initDate?: Dayjs,
    endDate?: Dayjs,
  ): T[] {
    if (!config || config.length === 0) {
      return [];
    }

    return config.filter((item) => {
      const validFrom = this.dayjsService.parse(item.validFrom);
      const validUntil = this.dayjsService.parse(item.validUntil);

      if (validFrom && endDate && endDate.diff(validFrom, "day") < 0) {
        return false;
      }
      if (validUntil && initDate && initDate.diff(validUntil, "day") > 0) {
        return false;
      }

      return true;
    });
  }

  private getCurrentTemporalConfiguration<T extends TemporalConfiguration>(
    range: Defined<RangeSelectorForm>,
    config?: T[],
  ): T | undefined {
    const appliedConfigurations = this.getAppliedTemporalConfiguration(
      config,
      range.endDate,
      range.endDate,
    );

    return appliedConfigurations?.length > 0
      ? appliedConfigurations[0]
      : undefined;
  }

  private calculatePowerPeriod(
    hiredPower: number,
    cost: number,
    initDate: Dayjs,
    endDate: Dayjs,
  ): InvoiceEntry {
    const days = endDate.diff(initDate, "day") + 1;

    return {
      initDate: initDate,
      endDate: endDate,
      calculationDetail: `${this.numberUtilsService.formatNumberWithUnit(
        hiredPower,
        "kW",
      )} x ${this.numberUtilsService.formatNumberWithUnit(
        days,
        $localize`:@@invoice-detail.days:days`,
      )} x ${this.numberUtilsService.formatNumberWithUnit(
        cost,
        "€/kW/" + $localize`:@@invoice-detail.day:day`,
        "1.2-5",
      )}`,
      value: this.numberUtilsService.roundNumber(hiredPower * days * cost),
    };
  }

  private calculateEnergyPeriod(
    consumption: number,
    cost: number,
    initDate: Dayjs,
    endDate: Dayjs,
  ): InvoiceEntry {
    return {
      initDate: initDate,
      endDate: endDate,
      calculationDetail: `${this.numberUtilsService.formatNumberWithUnit(
        consumption,
        "kWh",
      )} x ${this.numberUtilsService.formatNumberWithUnit(
        cost,
        "€/kWh/" + $localize`:@@invoice-detail.day:day`,
        "1.2-5",
      )}`,
      value: this.numberUtilsService.roundNumber(consumption * cost),
    };
  }

  private isHoliday(date: Dayjs, configuration: Configuration | null): boolean {
    const isoDate = this.dayjsService.format(date, DateFormats.ISO_LOCALDATE);
    return (configuration?.holidays?.indexOf(isoDate) ?? -1) >= 0;
  }

  private getDateRangeSuffix(initDate: Dayjs, endDate: Dayjs): string {
    return ` (${this.dayjsService.format(
      initDate,
      "L",
    )} - ${this.dayjsService.format(endDate, "L")})`;
  }

  buildInvoiceConcept(
    title: string,
    entry: InvoiceEntry | InvoicePeriodEntry,
    list?: InvoicePeriodEntry[],
    subconceptsTitles?: Partial<Record<Period, string>>,
    type?: "total" | "subtotal",
  ): InvoiceConcept {
    const concept: InvoiceConcept = {
      title: title,
      value: entry.value,
      type: type,
    };

    if (this.isInvoicePeriodEntry(entry)) {
      concept.subconcepts = (<Period[]>["P1", "P2", "P3"]).reduce(
        (subconcepts, key) => {
          if (entry[key]) {
            subconcepts.push(
              this.buildInvoiceConcept(
                subconceptsTitles && subconceptsTitles[key]
                  ? <string>subconceptsTitles[key]
                  : key,
                <InvoiceEntry>entry[key],
              ),
            );
          }
          return subconcepts;
        },
        <InvoiceConcept[]>[],
      );
    } else {
      concept.calculationDetail = entry.calculationDetail;
    }

    if (list && list.length > 1) {
      concept.title += this.getDateRangeSuffix(entry.initDate, entry.endDate);
    }

    return concept;
  }

  get powerSubconceptsTitles(): Partial<Record<Period, string>> {
    return {
      P1: $localize`:@@invoice-detail.power-period.p1-peak:P1 (peak)`,
      P2: $localize`:@@invoice-detail.power-period.p2-valley:P2 (valley)`,
    };
  }

  get energySubconceptsTitles(): Partial<Record<Period, string>> {
    return {
      P1: $localize`:@@invoice-detail.energy-period.p1-peak:P1 (peak)`,
      P2: $localize`:@@invoice-detail.energy-period.p2-flat:P2 (flat)`,
      P3: $localize`:@@invoice-detail.energy-period.p3-valley:P3 (valley)`,
    };
  }
}
