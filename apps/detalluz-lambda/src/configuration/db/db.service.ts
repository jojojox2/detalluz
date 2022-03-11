import { MongoClient } from "mongodb";
import { Configuration } from "@detalluz/api";
import { AppError } from "../../common/error";
import { CONFIGURATION_MOCK, DbConfiguration } from "./db.model";

export async function getConfiguration(): Promise<Configuration> {
  console.debug(`Invoking: getConfiguration()`);

  const configuration = await findConfiguration();

  if (!configuration) {
    throw new AppError("Configuration not available");
  }
  return configuration;
}

async function findConfiguration(): Promise<DbConfiguration | null> {
  const dbUri = process.env["MONGODB_URI"];

  if (!dbUri) {
    console.warn("MONGODB_URI property not found! Using mocked values");
    return CONFIGURATION_MOCK;
  }

  const client = new MongoClient(dbUri);

  try {
    await client.connect();

    const database = client.db("detalluz");
    const collection = database.collection<DbConfiguration>("configuration");
    return await collection.findOne<DbConfiguration>(
      { id: "main" },
      {
        projection: { _id: 0, id: 0 },
      },
    );
  } catch (e) {
    console.error(e);
    throw new AppError("Error connecting to the database");
  } finally {
    await client.close();
  }
}
