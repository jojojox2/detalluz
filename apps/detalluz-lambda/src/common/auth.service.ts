import { UserData } from "@detalluz/api";
import crypto from "crypto";
import jsonwebtoken, { JwtPayload, TokenExpiredError } from "jsonwebtoken";
import { AppError } from "./error";

export function createToken(input: UserData): string {
  console.debug(`Invoking: createToken(${input.username}, ***)`);

  const publicKey = process.env["RSA_PUBLIC_KEY"];
  const jwtToken = process.env["JWT_TOKEN"];

  if (!publicKey || !jwtToken) {
    throw new AppError("Missing configuration properties");
  }

  try {
    const encryptedPassword: string = crypto
      .publicEncrypt(
        {
          key: publicKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: "sha256",
        },
        Buffer.from(input.password, "utf8"),
      )
      .toString("base64");

    const tokenPayload: JwtPayload = {
      user: input.username,
      session: encryptedPassword,
    };

    const token: string = jsonwebtoken.sign(tokenPayload, jwtToken, {
      algorithm: "HS256",
      expiresIn: "1y",
    });

    return token;
  } catch (error) {
    console.error(error);
    throw new AppError("Could not generate a valid token", 500);
  }
}

export function validateToken(authorization: string | undefined): UserData {
  console.debug(`Invoking: validateToken(***)`);

  const authHeader = authorization?.split(" ");

  if (
    !authHeader ||
    authHeader.length !== 2 ||
    authHeader[0].toLowerCase() !== "bearer" ||
    !authHeader[1]
  ) {
    throw new AppError("Invalid authorization header", 401);
  }

  const token = authHeader[1];

  const privateKey = process.env["RSA_PRIVATE_KEY"];
  const jwtToken = process.env["JWT_TOKEN"];

  if (!privateKey || !jwtToken) {
    throw new AppError("Missing configuration properties");
  }

  let payload: JwtPayload | string;

  try {
    payload = jsonwebtoken.verify(token, jwtToken, {
      algorithms: ["HS256"],
    });
  } catch (error) {
    console.error(error);
    if (error instanceof TokenExpiredError) {
      throw new AppError("Expired token", 401);
    } else {
      throw new AppError("Invalid token", 401);
    }
  }

  if (
    typeof payload === "string" ||
    payload instanceof String ||
    !payload?.["session"]
  ) {
    throw new AppError("Invalid token", 401);
  }

  try {
    const decryptedPassword = crypto
      .privateDecrypt(
        {
          key: privateKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: "sha256",
        },
        Buffer.from(payload["session"], "base64"),
      )
      .toString("utf8");

    const userData: UserData = {
      username: payload["user"],
      password: decryptedPassword,
    };

    return userData;
  } catch (error) {
    console.error(error);
    throw new AppError("Invalid token", 401);
  }
}
