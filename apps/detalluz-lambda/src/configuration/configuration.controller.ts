import { Configuration } from "@detalluz/api";
import { getConfiguration } from "../integrations/db/db.service";

export async function configuration(): Promise<Configuration> {
  const result: Configuration = await getConfiguration();

  return result;
}
