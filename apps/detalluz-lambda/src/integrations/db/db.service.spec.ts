import { Configuration } from "@detalluz/api";
import { Collection, MongoClient } from "mongodb";
import { AppError } from "../../common/error";
import { init } from "../../common/rest";
import { CONFIGURATION_MOCK } from "./db.model";
import { getConfiguration } from "./db.service";

const mockCollection: Partial<Collection<Configuration>> = {};
const mockMongoClient: Partial<MongoClient> = {
  connect: jest.fn().mockResolvedValue(null),
  db: jest.fn().mockReturnValue({
    collection: jest.fn().mockReturnValue(mockCollection),
  }),
  close: jest.fn().mockResolvedValue(null),
};

jest.mock("mongodb", () => {
  return {
    MongoClient: jest.fn().mockImplementation(() => {
      return mockMongoClient;
    }),
  };
});

beforeAll(() => {
  init();
});

beforeEach(() => {
  process.env["MONGODB_URI"] = "<mongodb uri>";

  mockCollection.findOne = jest.fn().mockResolvedValue(CONFIGURATION_MOCK);
});

describe("getPVPCPrices", () => {
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

    await expect(getConfiguration()).rejects.toBeInstanceOf(AppError);
  });

  it("should return a mocked value if the database uri is not defined", async () => {
    process.env["MONGODB_URI"] = "";

    const response = await getConfiguration();

    expect(response).toBeDefined();
    expect(response).toStrictEqual(CONFIGURATION_MOCK);
  });
});
