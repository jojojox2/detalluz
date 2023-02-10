import crypto from "crypto";
import jsonwebtoken, { TokenExpiredError } from "jsonwebtoken";
import { createToken, validateToken } from "./auth.service";
import { init } from "./config";
import { AppError } from "./error";

jest.mock("crypto");
jest.mock("jsonwebtoken");

beforeAll(() => {
  init();
});

beforeEach(() => {
  process.env["RSA_PUBLIC_KEY"] = "<public key>";
  process.env["RSA_PRIVATE_KEY"] = "<private key>";
  process.env["JWT_TOKEN"] = "<jwt token>";
});

describe("createToken", () => {
  it("should create a valid token", async () => {
    const encodedSecret = Buffer.from("encodedSecret", "utf8");
    (crypto.publicEncrypt as jest.Mock).mockReturnValue(encodedSecret);
    const sign = (jsonwebtoken.sign as jest.Mock).mockReturnValue("xyz");

    const token = createToken({
      target: "fake",
      username: "test",
      password: "password",
    });

    expect(token).toBeDefined();
    expect(token).toBe("xyz");
    expect(sign).toHaveBeenCalledWith(
      expect.objectContaining({
        user: "test",
        session: encodedSecret.toString("base64"),
      }),
      expect.anything(),
      expect.anything(),
    );
  });

  it("should detect missing configuration properties", async () => {
    (crypto.publicEncrypt as jest.Mock).mockImplementation(() => {
      throw new Error("publicEncrypt error");
    });
    (jsonwebtoken.sign as jest.Mock).mockImplementation(() => {
      throw new Error("sign error");
    });

    expect(() =>
      createToken({
        target: "fake",
        username: "test",
        password: "password",
      }),
    ).toThrowError(AppError);
  });

  it("should catch a signing error", async () => {
    process.env["RSA_PUBLIC_KEY"] = "";
    process.env["JWT_TOKEN"] = "";

    expect(() =>
      createToken({
        target: "fake",
        username: "test",
        password: "password",
      }),
    ).toThrowError(AppError);
  });
});

describe("validateToken", () => {
  it("should successfully validate a token", async () => {
    (jsonwebtoken.verify as jest.Mock).mockReturnValue({
      user: "test",
      session: "encodedPassword",
      target: "fake",
    });
    (crypto.privateDecrypt as jest.Mock).mockReturnValue(
      Buffer.from("password", "utf8"),
    );

    const userData = validateToken(`Bearer xyz`);

    expect(userData).toBeDefined();
    expect(userData).toStrictEqual({
      target: "fake",
      username: "test",
      password: "password",
    });
  });

  it("should detect an invalid authorization header", async () => {
    expect(() => validateToken(undefined)).toThrowError(AppError);
  });

  it("should detect an invalid token", async () => {
    (jsonwebtoken.verify as jest.Mock).mockImplementation(() => {
      throw new Error();
    });

    expect(() => validateToken("Bearer xyz")).toThrowError(AppError);
  });

  it("should detect an expired token", async () => {
    (jsonwebtoken.verify as jest.Mock).mockImplementation(() => {
      throw new TokenExpiredError("", new Date());
    });

    expect(() => validateToken("Bearer xyz")).toThrowError(AppError);
  });

  it("should detect an empty token payload", async () => {
    (jsonwebtoken.verify as jest.Mock).mockReturnValue(null);

    expect(() => validateToken("Bearer xyz")).toThrowError(AppError);
  });

  it("should detect an invalid token payload", async () => {
    (jsonwebtoken.verify as jest.Mock).mockReturnValue({
      user: "test",
      session: null,
    });

    expect(() => validateToken("Bearer xyz")).toThrowError(AppError);
  });

  it("should detect missing configuration properties", async () => {
    process.env["RSA_PRIVATE_KEY"] = "";
    process.env["JWT_TOKEN"] = "";

    expect(() => validateToken("Bearer xyz")).toThrowError(AppError);
  });

  it("should catch an error on decryption", async () => {
    (jsonwebtoken.verify as jest.Mock).mockReturnValue({
      user: "test",
      session: "encodedPassword",
    });
    (crypto.privateDecrypt as jest.Mock).mockImplementation(() => {
      throw new Error("privateDecrypt error");
    });

    expect(() => validateToken("Bearer xyz")).toThrowError(AppError);
  });
});
