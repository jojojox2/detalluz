import {
  validate,
  validateDateRange,
  Validations,
} from "../common/validations";
import {
  createSession as createIdeSession,
  getConsumption as getIdeConsumption,
} from "../integrations/ide/ide.service";
import { Consumption, DateRangeWithId, UserData } from "@detalluz/api";
import { AppError } from "../common/error";
import {
  createSession as createEredesSession,
  getConsumption as getEredesConsumption,
} from "../integrations/eredes/eredes.service";

export async function consumption(
  userData?: UserData,
  params?: DateRangeWithId,
): Promise<Consumption> {
  validateDateRange(params);

  switch (userData?.target) {
    case "ide":
      return ideConsumption(userData, params);
    case "eredes":
      return eredesConsumption(userData, params);
    default:
      throw new AppError("Invalid target");
  }
}

async function ideConsumption(
  userData: UserData,
  params?: DateRangeWithId,
): Promise<Consumption> {
  const sessionId = await createIdeSession(userData);

  const initDate = <string>(<DateRangeWithId>params).initDate;
  const endDate = <string>(<DateRangeWithId>params).endDate;

  const result: Consumption = await getIdeConsumption(
    sessionId,
    initDate,
    endDate,
  );

  return result;
}

async function eredesConsumption(
  userData: UserData,
  params?: DateRangeWithId,
): Promise<Consumption> {
  validate(params, {
    id: [Validations.required],
  });
  const sessionId = await createEredesSession(userData);

  const initDate = <string>(<DateRangeWithId>params).initDate;
  const endDate = <string>(<DateRangeWithId>params).endDate;
  const id = <string>(<DateRangeWithId>params).id;

  const result: Consumption = await getEredesConsumption(
    sessionId,
    initDate,
    endDate,
    id,
  );

  return result;
}
