import { createSession, getContracts } from "../integrations/ide/ide.service";
import { Contract, UserData } from "@detalluz/api";

export async function contracts(userData: UserData): Promise<Contract[]> {
  const sessionId = await createSession(userData);

  const result: Contract[] = await getContracts(sessionId);

  return result;
}
