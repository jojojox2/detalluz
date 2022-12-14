import axios from "axios";
import { AppError } from "../../common/error";
import { init } from "../../common/rest";
import { createSession, getConsumption, getContracts } from "./ide.service";

jest.mock("axios");

beforeAll(() => {
  init();
});

const userData = {
  username: "test",
  password: "password",
};

describe("createSession", () => {
  it("should generate a session id", async () => {
    (axios.post as jest.Mock).mockResolvedValue({
      status: 200,
      headers: {
        "set-cookie": ["JSESSIONID=xyz;"],
      },
      data: {
        success: "true",
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
        success: "false",
      },
    });

    await expect(createSession(userData)).rejects.toBeInstanceOf(AppError);
  });

  it("should detect when a session was not created", async () => {
    (axios.post as jest.Mock).mockResolvedValue({
      status: 200,
      headers: {
        "set-cookie": null,
      },
      data: {
        success: "true",
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
    (axios.get as jest.Mock).mockResolvedValue({
      status: 200,
      data: {
        fechaPeriodo: "01-01-202100:00:00",
        y: {
          data: [
            [
              {
                valor: 1,
              },
              {
                valor: 2,
              },
            ],
          ],
        },
      },
    });

    const consumption = await getConsumption(
      "sessionId",
      "2021-01-01",
      "2021-01-01",
    );

    expect(consumption).toBeDefined();
    expect(consumption.consumption).toBeDefined();
    expect(consumption.consumption.length).toBe(2);
    expect(consumption.consumption[1]).toStrictEqual({
      date: "2021-01-01T01:00:00.000+01:00",
      value: 2,
    });
  });

  it("should handle a null response", async () => {
    (axios.get as jest.Mock).mockResolvedValue({
      status: 200,
      data: null,
    });

    const consumption = await getConsumption(
      "sessionId",
      "2021-01-01",
      "2021-01-01",
    );

    expect(consumption).toBeDefined();
    expect(consumption.consumption).toBeDefined();
    expect(consumption.consumption.length).toBe(0);
  });

  it("should handle a connection error", async () => {
    (axios.get as jest.Mock).mockRejectedValue("error");

    await expect(
      getConsumption("sessionId", "2021-01-01", "2021-01-01"),
    ).rejects.toBeInstanceOf(AppError);
  });
});

describe("getContracts", () => {
  it("should retrieve the contracts data", async () => {
    (axios.get as jest.Mock)
      .mockResolvedValueOnce({
        status: 200,
        data: {
          listaSalida: [["", "", "123456"]],
        },
      })
      .mockResolvedValue({
        status: 200,
        data: {
          datos: [
            {
              direccion: "Fake street 123",
              cups: "ESXX",
              codContrato: "123",
            },
          ],
        },
      });

    const contracts = await getContracts("sessionId");

    expect(contracts).toBeDefined();
    expect(contracts.length).toBe(1);
    expect(contracts[0]).toStrictEqual({
      id: "123",
      cups: "ESXX",
      address: "Fake street 123",
    });
  });

  it("should handle a connection error for costumers", async () => {
    (axios.get as jest.Mock).mockRejectedValue("error");

    await expect(getContracts("sessionId")).rejects.toBeInstanceOf(AppError);
  });

  it("should handle a connection error for contracts", async () => {
    (axios.get as jest.Mock)
      .mockResolvedValueOnce({
        status: 200,
        data: {
          listaSalida: [["", "", "123456"]],
        },
      })
      .mockRejectedValue("error");

    await expect(getContracts("sessionId")).rejects.toBeInstanceOf(AppError);
  });
});
