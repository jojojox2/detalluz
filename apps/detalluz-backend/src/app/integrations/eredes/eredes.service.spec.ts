import axios from "axios";
import { init } from "../../common/config";
import { AppError } from "../../common/error";
import { createSession, getConsumption, getContracts } from "./eredes.service";

jest.mock("axios");

beforeAll(() => {
  init();
});

const userData = {
  target: "eredes",
  username: "test",
  password: "password",
};

describe("createSession", () => {
  it("should generate a session id", async () => {
    (axios.post as jest.Mock).mockResolvedValue({
      status: 200,
      data: {
        result: `{"accessToken":"xyz"}`,
      },
    });

    const sessionId = await createSession(userData);

    expect(sessionId).toBeDefined();
    expect(sessionId).toBe("xyz");
  });

  it("should handle a null response", async () => {
    (axios.post as jest.Mock).mockResolvedValue({
      status: 200,
      data: null,
    });

    await expect(createSession(userData)).rejects.toBeInstanceOf(AppError);
  });

  it("should detect invalid credentials", async () => {
    (axios.post as jest.Mock).mockResolvedValue({
      status: 200,
      data: {
        result: `{"error":"error"}`,
      },
    });

    await expect(createSession(userData)).rejects.toBeInstanceOf(AppError);
  });

  it("should handle a connection error", async () => {
    (axios.post as jest.Mock).mockRejectedValue("error");

    await expect(createSession(userData)).rejects.toBeInstanceOf(AppError);
  });
});

describe("getConsumption", () => {
  it("should retrieve the consumption data", async () => {
    (axios.post as jest.Mock).mockResolvedValue({
      status: 200,
      data: {
        result: `[
          {
            "datetime": "01-01-2021 01:00",
            "estimated": "r",
            "consumo": 0.001
          },
          {
            "datetime": "01-01-2021 02:00",
            "estimated": "r",
            "consumo": 0.002
          }
        ]`,
      },
    });

    const consumption = await getConsumption(
      "sessionId",
      "2021-01-01",
      "2021-01-01",
      "ESXX-00",
    );

    expect(consumption).toBeDefined();
    expect(consumption.consumption).toBeDefined();
    expect(consumption.consumption.length).toBe(2);
    expect(consumption.consumption[1]).toStrictEqual({
      date: "2021-01-01T01:00:00.000+01:00",
      value: 2,
    });
  });

  it("should handle an invalid date", async () => {
    (axios.post as jest.Mock).mockResolvedValue({
      status: 200,
      data: {
        result: `[
          {
            "datetime": "",
            "estimated": "r",
            "consumo": 0.001
          }
        ]`,
      },
    });

    const consumption = await getConsumption(
      "sessionId",
      "2021-01-01",
      "2021-01-01",
      "ESXX-00",
    );

    expect(consumption).toBeDefined();
    expect(consumption.consumption).toBeDefined();
    expect(consumption.consumption.length).toBe(0);
  });

  it("should handle a connection error", async () => {
    (axios.post as jest.Mock).mockRejectedValue("error");

    await expect(
      getConsumption("sessionId", "2021-01-01", "2021-01-01", "ESXX-00"),
    ).rejects.toBeInstanceOf(AppError);
  });
});

describe("getContracts", () => {
  it("should retrieve the contracts data", async () => {
    (axios.post as jest.Mock).mockResolvedValue({
      status: 200,
      data: {
        result: `[
            {
              "CUPS": "ESXX",
              "DIR": "Fake street 123",
              "ACTIVO": "S",
              "SECTOR": "00"
            }
          ]`,
      },
    });

    const contracts = await getContracts("sessionId");

    expect(contracts).toBeDefined();
    expect(contracts.length).toBe(1);
    expect(contracts[0]).toStrictEqual({
      id: "ESXX-00",
      cups: "ESXX",
      address: "Fake street 123",
    });
  });

  it("should handle a connection error", async () => {
    (axios.post as jest.Mock).mockRejectedValue("error");

    await expect(getContracts("sessionId")).rejects.toBeInstanceOf(AppError);
  });
});
