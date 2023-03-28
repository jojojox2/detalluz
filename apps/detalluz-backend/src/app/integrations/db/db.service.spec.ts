import { Configuration } from "@detalluz/api";
import { Collection, Db } from "mongodb";
import { Detalluz, init } from "../../common/config";
import { AppError } from "../../common/error";
import { CONFIGURATION_MOCK } from "./db.model";
import { getConfiguration } from "./db.service";

const mockCollection: Partial<Collection<Configuration>> = {};

beforeAll(() => {
  init();
});

beforeEach(() => {
  Detalluz.db = {
    collection: jest.fn().mockReturnValue(mockCollection),
  } as unknown as Db;

  mockCollection.findOne = jest.fn().mockResolvedValue(CONFIGURATION_MOCK);
});

describe("getConfiguration", () => {
  it("should retrieve the configuration from the db", async () => {
    const response = await getConfiguration();

    expect(response).toBeDefined();
    expect(response).toStrictEqual(CONFIGURATION_MOCK);
  });

  it("should rise an error if no configuration is found", async () => {
    mockCollection.findOne = jest.fn().mockResolvedValue(null);

    await expect(getConfiguration()).rejects.toBeInstanceOf(AppError);
  });

  it("should rise an error if there is a connection error", async () => {
    mockCollection.findOne = jest.fn().mockRejectedValue("error");

    await expect(getConfiguration()).rejects.toBeDefined();
  });

  it("should return a mocked value if the database uri is not defined", async () => {
    Detalluz.db = undefined;

    const response = await getConfiguration();

    expect(response).toBeDefined();
    expect(response).toStrictEqual(CONFIGURATION_MOCK);
  });
});
