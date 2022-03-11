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
import { InvoiceConcept } from "./invoice-detail.component";

@Injectable({
  providedIn: "root",
})
export class InvoiceDetailService {
  constructor(
    private dayjsService: DayjsService,
    private numberUtilsService: NumberUtilsService,
  ) {}

  calculatePowerCostsSubconceptsByPeriod(
    config: TemporalPeriodConfiguration[] | undefined,
    title: string,
    range: Defined<RangeSelectorForm>,
    invoiceConfiguration: InvoiceConfiguration,
  ): InvoiceConcept[] {
    const concepts: InvoiceConcept[] = [];

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

      const days = endDate.diff(initDate, "day") + 1;

      const concept: InvoiceConcept = {
        title: title,
        subconcepts: [],
      };

      if (tempConfig.value.P1) {
        concept.subconcepts?.push(
          this.calculatePowerPeriodSubconcept(
            $localize`:@@invoice-detail.power-period.p1-peak:P1 (peak)`,
            invoiceConfiguration?.peakHiredPower ?? 0,
            tempConfig.value.P1,
            days,
          ),
        );
      }

      if (tempConfig.value.P2) {
        concept.subconcepts?.push(
          this.calculatePowerPeriodSubconcept(
            $localize`:@@invoice-detail.power-period.p2-valley:P2 (valley)`,
            invoiceConfiguration?.valleyHiredPower ?? 0,
            tempConfig.value.P2,
            days,
          ),
        );
      }

      if (temporalConfigurations.length > 1) {
        concept.title += ` (${this.dayjsService.format(
          initDate,
          "L",
        )} - ${this.dayjsService.format(endDate, "L")})`;
      }

      concept.value = this.sumConceptsValues(concept.subconcepts);

      concepts.push(concept);
    });

    return concepts;
  }

  calculatePowerCostsSubconceptsByValue(
    config: TemporalConfigurationValue[] | undefined,
    title: string,
    range: Defined<RangeSelectorForm>,
    hiredPower: number,
  ): InvoiceConcept[] {
    const concepts: InvoiceConcept[] = [];

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

      const days = endDate.diff(initDate, "day") + 1;

      const concept = this.calculatePowerPeriodSubconcept(
        title,
        hiredPower,
        tempConfig.value,
        days,
      );

      if (temporalConfigurations.length > 1) {
        concept.title += ` (${this.dayjsService.format(
          initDate,
          "L",
        )} - ${this.dayjsService.format(endDate, "L")})`;
      }

      concepts.push(concept);
    });

    return concepts;
  }

  calculateEnergyCostsSubconceptsByPeriod(
    config: TemporalPeriodConfiguration[] | undefined,
    consumptionByDay: Record<string, Record<Period, number>>,
    title: string,
    range: Defined<RangeSelectorForm>,
  ): InvoiceConcept[] {
    const concepts: InvoiceConcept[] = [];

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

      const concept: InvoiceConcept = {
        title: title,
        subconcepts: [],
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
        concept.subconcepts?.push(
          this.calculateEnergyPeriodSubconcept(
            $localize`:@@invoice-detail.energy-period.p1-peak:P1 (peak)`,
            consumptionInPeriod.P1,
            tempConfig.value.P1,
          ),
        );
      }

      if (tempConfig.value.P2) {
        concept.subconcepts?.push(
          this.calculateEnergyPeriodSubconcept(
            $localize`:@@invoice-detail.energy-period.p2-flat:P2 (flat)`,
            consumptionInPeriod.P2,
            tempConfig.value.P2,
          ),
        );
      }

      if (tempConfig.value.P3) {
        concept.subconcepts?.push(
          this.calculateEnergyPeriodSubconcept(
            $localize`:@@invoice-detail.energy-period.p3-valley:P3 (valley)`,
            consumptionInPeriod.P3,
            tempConfig.value.P3,
          ),
        );
      }

      if (temporalConfigurations.length > 1) {
        concept.title += ` (${this.dayjsService.format(
          initDate,
          "L",
        )} - ${this.dayjsService.format(endDate, "L")})`;
      }

      concept.value = this.sumConceptsValues(concept.subconcepts);

      concepts.push(concept);
    });

    return concepts;
  }

  calculateEnergyCostsSubconceptsByValue(
    config: TemporalConfigurationValue[] | undefined,
    consumptionByDay: Record<string, Record<Period, number>>,
    title: string,
    range: Defined<RangeSelectorForm>,
  ): InvoiceConcept[] {
    const concept: InvoiceConcept = {
      title: title,
      subconcepts: [],
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

      concept.subconcepts?.push(
        this.calculateEnergyPeriodSubconcept(
          `${this.dayjsService.format(
            initDate,
            "L",
          )} - ${this.dayjsService.format(endDate, "L")}`,
          consumptionInPeriod,
          tempConfig.value,
        ),
      );
    });

    concept.value = this.sumConceptsValues(concept.subconcepts);

    if (concept.subconcepts?.length === 1) {
      concept.calculationDetail = concept.subconcepts[0].calculationDetail;
      concept.value = concept.subconcepts[0].value;
      concept.subconcepts = concept.subconcepts[0].subconcepts;
    }

    return [concept];
  }

  calculatePercentageConcept(
    baseConcepts: InvoiceConcept[],
    title: string,
    config: TemporalConfigurationValue[] | undefined,
    range: Defined<RangeSelectorForm>,
  ): InvoiceConcept {
    const taxValue =
      this.getCurrentTemporalConfiguration(range, config)?.value ?? 0;
    const baseValue = this.sumConceptsValues(baseConcepts) ?? 0;

    const value = this.numberUtilsService.roundNumber(
      baseValue * (taxValue / 100),
    );

    return {
      title: title,
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
    title: string,
    range: Defined<RangeSelectorForm>,
    config: TemporalConfigurationValue[] | undefined,
  ): InvoiceConcept {
    const dailyCost =
      this.getCurrentTemporalConfiguration(range, config)?.value ?? 0;
    const days = range.endDate.diff(range.initDate, "day") + 1;

    const value = this.numberUtilsService.roundNumber(dailyCost * days);

    return {
      title: title,
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

  calculateSumConcept(
    baseConcepts: InvoiceConcept[],
    title: string,
    type?: "total" | "subtotal",
  ): InvoiceConcept {
    return {
      title: title,
      type: type,
      value: this.sumConceptsValues(baseConcepts),
    };
  }

  sumConceptsValues(
    concepts: InvoiceConcept[] | undefined,
  ): number | undefined {
    return concepts?.reduce(
      (value, concept) => (concept.value ? value + concept.value : value),
      0,
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

  private calculatePowerPeriodSubconcept(
    title: string,
    hiredPower: number,
    cost: number,
    days: number,
  ): InvoiceConcept {
    return {
      title: title,
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

  private calculateEnergyPeriodSubconcept(
    title: string,
    consumption: number,
    cost: number,
  ): InvoiceConcept {
    return {
      title: title,
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
}
