import { init } from "../common/rest";
import { charges, prices } from "./prices.controller";
import { getPVPCCharges, getPVPCPrices } from "../integrations/ree/ree.service";

jest.mock("../integrations/ree/ree.service");

beforeAll(() => {
  init();
});

describe("prices", () => {
  it("should retrieve prices data", async () => {
    (getPVPCPrices as jest.Mock).mockReturnValue({
      prices: [
        {
          date: "2021-01-01T00:00:00.000+01:00",
          value: 1,
        },
        {
          date: "2021-01-01T01:00:00.000+01:00",
          value: 2,
        },
      ],
    });

    const params = {
      initDate: "2021-01-01",
      endDate: "2021-01-01",
    };

    const response = await prices(params);

    expect(response).toBeDefined();
    expect(response.prices).toBeDefined();
    expect(response.prices.length).toBe(2);
  });
});

describe("charges", () => {
  it("should retrieve charges data", async () => {
    (getPVPCCharges as jest.Mock).mockReturnValue({
      charges: [
        {
          date: "2021-01-01T00:00:00.000+01:00",
          value: 1,
        },
        {
          date: "2021-01-01T01:00:00.000+01:00",
          value: 2,
        },
      ],
    });

    const params = {
      initDate: "2021-01-01",
      endDate: "2021-01-01",
    };

    const response = await charges(params);

    expect(response).toBeDefined();
    expect(response.charges).toBeDefined();
    expect(response.charges.length).toBe(2);
  });
});
