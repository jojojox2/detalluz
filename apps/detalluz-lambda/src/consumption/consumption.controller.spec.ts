import { LoginData } from "@detalluz/api";
import { createToken } from "../common/auth.service";
import { init } from "../common/rest";
import { consumption, login } from "./consumption.controller";
import { createSession, getConsumption } from "./ide/ide.service";

jest.mock("./ide/ide.service");
jest.mock("../common/auth.service");

beforeAll(() => {
  init();
});

const loginData: LoginData = {
  username: "test",
  password: "password",
};

describe("login", () => {
  it("should create a valid token", async () => {
    (createSession as jest.Mock).mockResolvedValue("sessionId");
    (createToken as jest.Mock).mockReturnValue("token");

    const response = await login(loginData);

    expect(response).toBeDefined();
    expect(response.token).toBeDefined();
    expect(response.token).toBe("token");
  });
});

describe("consumption", () => {
  it("should retrieve consumption data", async () => {
    (createSession as jest.Mock).mockResolvedValue("sessionId");
    (getConsumption as jest.Mock).mockReturnValue({
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

    const response = await consumption(loginData, params);

    expect(response).toBeDefined();
    expect(response.consumption).toBeDefined();
    expect(response.consumption.length).toBe(2);
  });
});
