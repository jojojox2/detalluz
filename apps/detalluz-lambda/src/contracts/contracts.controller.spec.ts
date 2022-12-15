import { LoginData } from "@detalluz/api";
import { init } from "../common/rest";
import { contracts } from "./contracts.controller";
import {
  createSession as createIdeSession,
  getContracts as getIdeContracts,
} from "../integrations/ide/ide.service";
import {
  createSession as createEredesSession,
  getContracts as getEredesContracts,
} from "../integrations/eredes/eredes.service";
import { AppError } from "../common/error";

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

describe("contracts", () => {
  it("should retrieve contracts data for i-DE", async () => {
    (createIdeSession as jest.Mock).mockResolvedValue("sessionId");
    (getIdeContracts as jest.Mock).mockReturnValue([
      {
        id: "123",
        cups: "ESXX",
        address: "Fake street 123",
      },
    ]);

    const response = await contracts(ideLoginData);

    expect(response).toBeDefined();
    expect(response.length).toBe(1);
  });

  it("should retrieve contracts data for E-REDES", async () => {
    (createEredesSession as jest.Mock).mockResolvedValue("sessionId");
    (getEredesContracts as jest.Mock).mockReturnValue([
      {
        id: "123",
        cups: "ESXX",
        address: "Fake street 123",
      },
    ]);

    const response = await contracts(eredesLoginData);

    expect(response).toBeDefined();
    expect(response.length).toBe(1);
  });

  it("should validate target", async () => {
    const missingLoginData: LoginData = {
      target: "none",
      username: "test",
      password: "password",
    };

    await expect(contracts(missingLoginData)).rejects.toBeInstanceOf(AppError);
  });
});
