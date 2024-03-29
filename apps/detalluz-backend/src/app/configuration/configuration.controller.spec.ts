import { init } from "../common/config";
import { configuration } from "./configuration.controller";
import { CONFIGURATION_MOCK } from "../integrations/db/db.model";
import { getConfiguration } from "../integrations/db/db.service";

jest.mock("../integrations/db/db.service");

beforeAll(() => {
  init();
});

describe("configuration", () => {
  it("should retrieve configuration data", async () => {
    (getConfiguration as jest.Mock).mockReturnValue(CONFIGURATION_MOCK);
    CONFIGURATION_MOCK;
    const response = await configuration();

    expect(response).toBeDefined();
    expect(response).toStrictEqual(CONFIGURATION_MOCK);
  });
});
