import { Detalluz, init } from "./config";

jest.mock("mongodb", () => {
  return {
    MongoClient: jest.fn().mockImplementation(() => {
      return {
        db: jest.fn().mockReturnValue({}),
      };
    }),
  };
});

beforeEach(() => {
  process.env["MONGODB_URI"] = "<mongodb uri>";
});

describe("init", () => {
  it("should initialize the database connection", async () => {
    Detalluz.db = undefined;

    init();

    expect(Detalluz.db).toBeDefined();
  });

  it("should skip database connection when uri is not set", async () => {
    Detalluz.db = undefined;
    process.env["MONGODB_URI"] = "";

    init();

    expect(Detalluz.db).not.toBeDefined();
  });
});
