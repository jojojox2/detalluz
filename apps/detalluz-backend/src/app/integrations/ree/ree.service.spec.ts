import axios from "axios";
import { AppError } from "../../common/error";
import { init } from "../../common/config";
import { getPVPCCharges, getPVPCPrices } from "./ree.service";

jest.mock("axios");

beforeAll(() => {
  init();
});

describe("getPVPCPrices", () => {
  it("should retrieve the prices for a date range", async () => {
    (axios.get as jest.Mock).mockResolvedValue({
      status: 200,
      data: {
        indicator: {
          values: [
            {
              datetime: "2021-01-01T00:00:00.000+01:00",
              value: 100,
            },
            {
              datetime: "2021-01-01T01:00:00.000+01:00",
              value: 200,
            },
          ],
        },
      },
    });

    const prices = await getPVPCPrices("2021-01-01", "2021-01-01");

    expect(prices).toBeDefined();
    expect(prices.prices).toBeDefined();
    expect(prices.prices.length).toBe(2);
    expect(prices.prices[1]).toStrictEqual({
      date: "2021-01-01T01:00:00.000+01:00",
      value: 0.2,
    });
  });

  it("should handle a null response", async () => {
    (axios.get as jest.Mock).mockResolvedValue({
      status: 200,
      data: null,
    });

    const prices = await getPVPCPrices("2021-01-01", "2021-01-01");

    expect(prices).toBeDefined();
    expect(prices.prices).toBeDefined();
    expect(prices.prices.length).toBe(0);
  });

  it("should handle an invalid indicator item", async () => {
    (axios.get as jest.Mock).mockResolvedValue({
      status: 200,
      data: {
        indicator: {
          values: [
            {
              datetime: null,
              value: 100,
            },
            null,
          ],
        },
      },
    });

    const prices = await getPVPCPrices("2021-01-01", "2021-01-01");

    expect(prices).toBeDefined();
    expect(prices.prices).toBeDefined();
    expect(prices.prices.length).toBe(0);
  });

  it("should handle a connection error", async () => {
    (axios.get as jest.Mock).mockRejectedValue("error");

    await expect(
      getPVPCPrices("2021-01-01", "2021-01-01"),
    ).rejects.toBeInstanceOf(AppError);
  });
});

describe("getPVPCCharges", () => {
  it("should retrieve the charges for a date range", async () => {
    (axios.get as jest.Mock).mockResolvedValue({
      status: 200,
      data: {
        indicator: {
          values: [
            {
              datetime: "2021-01-01T00:00:00.000+01:00",
              value: 100,
            },
            {
              datetime: "2021-01-01T01:00:00.000+01:00",
              value: 200,
            },
          ],
        },
      },
    });

    const charges = await getPVPCCharges("2021-01-01", "2021-01-01");

    expect(charges).toBeDefined();
    expect(charges.charges).toBeDefined();
    expect(charges.charges.length).toBe(2);
    expect(charges.charges[1]).toStrictEqual({
      date: "2021-01-01T01:00:00.000+01:00",
      value: 0.2,
    });
  });

  it("should handle a null response", async () => {
    (axios.get as jest.Mock).mockResolvedValue({
      status: 200,
      data: null,
    });

    const charges = await getPVPCCharges("2021-01-01", "2021-01-01");

    expect(charges).toBeDefined();
    expect(charges.charges).toBeDefined();
    expect(charges.charges.length).toBe(0);
  });

  it("should handle an invalid indicator item", async () => {
    (axios.get as jest.Mock).mockResolvedValue({
      status: 200,
      data: {
        indicator: {
          values: [
            {
              datetime: null,
              value: 100,
            },
            null,
          ],
        },
      },
    });

    const charges = await getPVPCCharges("2021-01-01", "2021-01-01");

    expect(charges).toBeDefined();
    expect(charges.charges).toBeDefined();
    expect(charges.charges.length).toBe(0);
  });

  it("should handle a connection error", async () => {
    (axios.get as jest.Mock).mockRejectedValue("error");

    await expect(
      getPVPCCharges("2021-01-01", "2021-01-01"),
    ).rejects.toBeInstanceOf(AppError);
  });
});
