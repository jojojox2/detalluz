export interface Configuration {
  vat?: TemporalConfigurationValue[];
  electricityTax?: TemporalConfigurationValue[];
  meterRental?: TemporalConfigurationValue[];
  marketingMargin?: TemporalConfigurationValue[];
  powerCosts: {
    distributionTolls?: TemporalPeriodConfiguration[];
    charges?: TemporalPeriodConfiguration[];
  };
  energyCosts: {
    tolls?: TemporalPeriodConfiguration[];
    charges?: TemporalPeriodConfiguration[];
  };
  holidays?: string[];
  fixedPrice?: {
    powerCosts?: TemporalPeriodConfiguration[];
    energyCosts?: TemporalConfigurationValue[];
  };
  communityElectricityTax?: TemporalConfigurationValue[];
}

export type PeriodConfiguration = Partial<
  Record<Period, TemporalConfigurationValue[]>
>;

export interface TemporalConfigurationValue extends TemporalConfiguration {
  value: number;
  unit?: string;
}

export interface TemporalPeriodConfiguration extends TemporalConfiguration {
  value: Partial<Record<Period, number>>;
  unit?: string;
}

export interface TemporalConfiguration {
  validFrom?: string;
  validUntil?: string;
}

export type Period = "P1" | "P2" | "P3";
