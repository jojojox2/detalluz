import { DateRange, Charges, Prices } from "@detalluz/api";
import { validateDateRange } from "../common/validations";
import { getPVPCCharges, getPVPCPrices } from "./ree/ree.service";

export async function prices(params?: DateRange): Promise<Prices> {
  validateDateRange(params);

  const initDate = <string>params?.initDate;
  const endDate = <string>params?.endDate;

  const result: Prices = await getPVPCPrices(initDate, endDate);

  return result;
}

export async function charges(params?: DateRange): Promise<Charges> {
  validateDateRange(params);

  const initDate = <string>params?.initDate;
  const endDate = <string>params?.endDate;

  const result: Charges = await getPVPCCharges(initDate, endDate);

  return result;
}
