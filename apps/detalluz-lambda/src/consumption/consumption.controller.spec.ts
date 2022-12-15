import { LoginData } from "@detalluz/api";
import { init } from "../common/rest";
import { consumption } from "./consumption.controller";
import {
  createSession as createIdeSession,
  getConsumption as getIdeConsumption,
} from "../integrations/ide/ide.service";
import { AppError } from "../common/error";
import {
  createSession as createEredesSession,
  getConsumption as getEredesConsumption,
} from "../integrations/eredes/eredes.service";

jest.mock("../integrations/eredes/eredes.service");
jest.mock("../integrations/ide/ide.service");
jest.mock("../common/auth.service");

beforeAll(() => {
  init();
});

const ideLoginData: LoginData = {
  target: "ide",
  username: "test",
  password: "password",
};

const eredesLoginData: LoginData = {
  target: "eredes",
  username: "test",
  password: "password",
};

describe("consumption", () => {
  it("should retrieve consumption data for i-DE", async () => {
    (createIdeSession as jest.Mock).mockResolvedValue("sessionId");
    (getIdeConsumption as jest.Mock).mockReturnValue({
      consumption: [
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

    const response = await consumption(ideLoginData, params);

    expect(response).toBeDefined();
    expect(response.consumption).toBeDefined();
    expect(response.consumption.length).toBe(2);
  });

  it("should retrieve consumption data for E-REDES", async () => {
    (createEredesSession as jest.Mock).mockResolvedValue("sessionId");
    (getEredesConsumption as jest.Mock).mockReturnValue({
      consumption: [
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

    const response = await consumption(eredesLoginData, params);

    expect(response).toBeDefined();
    expect(response.consumption).toBeDefined();
    expect(response.consumption.length).toBe(2);
  });

  it("should validate target", async () => {
    const missingLoginData: LoginData = {
      target: "none",
      username: "test",
      password: "password",
    };
    const params = {
      initDate: "2021-01-01",
      endDate: "2021-01-01",
    };

    await expect(consumption(missingLoginData, params)).rejects.toBeInstanceOf(
      AppError,
    );
  });
});
