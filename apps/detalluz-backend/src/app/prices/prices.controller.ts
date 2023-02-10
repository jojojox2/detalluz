import { DateRange, Charges, Prices } from "@detalluz/api";
import { validateDateRange } from "../common/validations";
import { getPVPCCharges, getPVPCPrices } from "../integrations/ree/ree.service";

export async function prices(
  user?: unknown,
  params?: DateRange,
): Promise<Prices> {
  validateDateRange(params);

  const initDate = <string>(<DateRange>params).initDate;
  const endDate = <string>(<DateRange>params).endDate;

  const result: Prices = await getPVPCPrices(initDate, endDate);

  return result;
}

export async function charges(
  user?: unknown,
  params?: DateRange,
): Promise<Charges> {
  validateDateRange(params);

  const initDate = <string>(<DateRange>params).initDate;
  const endDate = <string>(<DateRange>params).endDate;

  const result: Charges = await getPVPCCharges(initDate, endDate);

  return result;
}
