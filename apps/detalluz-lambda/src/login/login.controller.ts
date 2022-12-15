import { validate, Validations } from "../common/validations";
import { createToken } from "../common/auth.service";
import { createSession as createIdeSession } from "../integrations/ide/ide.service";
import { createSession as createEredesSession } from "../integrations/eredes/eredes.service";
import { LoginData, Token, UserData } from "@detalluz/api";
import { AppError } from "../common/error";

export async function login(input?: LoginData): Promise<Token> {
  validate(input, {
    target: [Validations.required],
    username: [Validations.required],
    password: [Validations.required],
  });

  const userData: UserData = {
    target: (<LoginData>input).target,
    username: (<LoginData>input).username,
    password: (<LoginData>input).password,
  };

  switch (userData.target) {
    case "ide":
      await createIdeSession(userData);
      break;
    case "eredes":
      await createEredesSession(userData);
      break;
    default:
      throw new AppError("Invalid target");
  }

  const token = createToken(userData);
  const result: Token = {
    token: token,
  };

  return result;
}
