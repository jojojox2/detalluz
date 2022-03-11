import { HourlyPrice } from "./common.model";

export interface LoginData {
  username: string;
  password: string;
}

export interface Consumption {
  unit?: string;
  consumption: HourlyPrice[];
}
