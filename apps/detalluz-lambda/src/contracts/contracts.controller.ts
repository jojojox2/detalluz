import { Contract, UserData } from "@detalluz/api";
import {
  createSession as createIdeSession,
  getContracts as getIdeContracts,
} from "../integrations/ide/ide.service";
import {
  createSession as createEredesSession,
  getContracts as getEredesContracts,
} from "../integrations/eredes/eredes.service";
import { AppError } from "../common/error";

export async function contracts(userData: UserData): Promise<Contract[]> {
  switch (userData.target) {
    case "ide":
      return ideContracts(userData);
    case "eredes":
      return eredesContracts(userData);
    default:
      throw new AppError("Invalid target");
  }
}

async function ideContracts(userData: UserData): Promise<Contract[]> {
  const sessionId = await createIdeSession(userData);

  const result: Contract[] = await getIdeContracts(sessionId);

  return result;
}

async function eredesContracts(userData: UserData): Promise<Contract[]> {
  const sessionId = await createEredesSession(userData);

  const result: Contract[] = await getEredesContracts(sessionId);

  return result;
}
