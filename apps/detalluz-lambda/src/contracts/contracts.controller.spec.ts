import { LoginData } from "@detalluz/api";
import { init } from "../common/rest";
import { contracts } from "./contracts.controller";
import { createSession, getContracts } from "../integrations/ide/ide.service";

jest.mock("../integrations/ide/ide.service");
jest.mock("../common/auth.service");

beforeAll(() => {
  init();
});

const loginData: LoginData = {
  username: "test",
  password: "password",
};

describe("contracts", () => {
  it("should retrieve contracts data", async () => {
    (createSession as jest.Mock).mockResolvedValue("sessionId");
    (getContracts as jest.Mock).mockReturnValue([
      {
        id: "123",
        cups: "ESXX",
        address: "Fake street 123",
      },
    ]);

    const response = await contracts(loginData);

    expect(response).toBeDefined();
    expect(response.length).toBe(1);
  });
});
