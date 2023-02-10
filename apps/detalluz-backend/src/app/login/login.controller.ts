import { validate, Validations } from "../common/validations";
import { createToken } from "../common/auth.service";
import { createSession as createIdeSession } from "../integrations/ide/ide.service";
import { createSession as createEredesSession } from "../integrations/eredes/eredes.service";
import { LoginData, Token, UserData } from "@detalluz/api";
import { AppError } from "../common/error";

export async function login(
  user?: unknown,
  params?: unknown,
  body?: LoginData,
): Promise<Token> {
  validate(body, {
    target: [Validations.required],
    username: [Validations.required],
    password: [Validations.required],
  });

  const userData: UserData = {
    target: (<LoginData>body).target,
    username: (<LoginData>body).username,
    password: (<LoginData>body).password,
  };

  switch (userData.target) {
    case "ide":
      await createIdeSession(userData);
      break;
    case "eredes":
      await createEredesSession(userData);
      break;
    default:
      throw new AppError("Invalid target", 422);
  }

  const token = createToken(userData);
  const result: Token = {
    token: token,
  };

  return result;
}
