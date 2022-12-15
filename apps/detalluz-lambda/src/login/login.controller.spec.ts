import { LoginData } from "@detalluz/api";
import { createToken } from "../common/auth.service";
import { init } from "../common/rest";
import { login } from "./login.controller";
import { createSession as createIdeSession } from "../integrations/ide/ide.service";
import { createSession as createEredesSession } from "../integrations/eredes/eredes.service";
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

describe("login", () => {
  it("should create a valid token for i-DE", async () => {
    (createIdeSession as jest.Mock).mockResolvedValue("sessionId");
    (createToken as jest.Mock).mockReturnValue("token");

    const response = await login(ideLoginData);

    expect(response).toBeDefined();
    expect(response.token).toBeDefined();
    expect(response.token).toBe("token");
  });

  it("should create a valid token for E-REDES", async () => {
    (createEredesSession as jest.Mock).mockResolvedValue("sessionId");
    (createToken as jest.Mock).mockReturnValue("token");

    const response = await login(eredesLoginData);

    expect(response).toBeDefined();
    expect(response.token).toBeDefined();
    expect(response.token).toBe("token");
  });

  it("should validate target", async () => {
    const missingLoginData: LoginData = {
      target: "none",
      username: "test",
      password: "password",
    };

    await expect(login(missingLoginData)).rejects.toBeInstanceOf(AppError);
  });
});
