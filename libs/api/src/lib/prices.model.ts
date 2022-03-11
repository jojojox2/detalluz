import { HourlyPrice } from "./common.model";

export interface Prices {
  unit?: string;
  prices: HourlyPrice[];
}

export interface Charges {
  unit?: string;
  charges: HourlyPrice[];
}
