import { Configuration } from "@detalluz/api";
import { AppError } from "../../common/error";
import { CONFIGURATION_MOCK, DbConfiguration } from "./db.model";
import { Detalluz } from "../../common/config";

export async function getConfiguration(): Promise<Configuration> {
  console.debug(`Invoking: getConfiguration()`);

  const configuration = await findConfiguration();

  if (!configuration) {
    throw new AppError("Configuration not available");
  }
  return configuration;
}

async function findConfiguration(): Promise<DbConfiguration | null> {
  if (!Detalluz.db) {
    console.warn("Database connection not found! Using mocked values");
    return CONFIGURATION_MOCK;
  }

  const collection = Detalluz.db.collection<DbConfiguration>("configuration");
  return await collection.findOne<DbConfiguration>(
    { id: "main" },
    {
      projection: { _id: 0, id: 0 },
    },
  );
}
