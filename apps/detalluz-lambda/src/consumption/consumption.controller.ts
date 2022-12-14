import {
  validate,
  validateDateRange,
  Validations,
} from "../common/validations";
import { createToken } from "../common/auth.service";
import { createSession, getConsumption } from "../integrations/ide/ide.service";
import {
  Consumption,
  DateRange,
  LoginData,
  Token,
  UserData,
} from "@detalluz/api";

export async function login(input?: LoginData): Promise<Token> {
  validate(input, {
    username: [Validations.required],
    password: [Validations.required],
  });

  const userData: UserData = {
    username: (<LoginData>input).username,
    password: (<LoginData>input).password,
  };

  await createSession(userData);

  const token = createToken(userData);
  const result: Token = {
    token: token,
  };

  return result;
}

export async function consumption(
  userData: UserData,
  params?: DateRange,
): Promise<Consumption> {
  validateDateRange(params);

  const sessionId = await createSession(userData);

  const initDate = <string>params?.initDate;
  const endDate = <string>params?.endDate;

  const result: Consumption = await getConsumption(
    sessionId,
    initDate,
    endDate,
  );

  return result;
}
