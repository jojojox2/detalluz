import { UserData } from "@detalluz/api";
import { Request, Response } from "express";
import { validateToken } from "./auth.service";
import { init } from "./config";
import { AppError } from "./error";
import { authenticate, handle } from "./rest";

jest.mock("./auth.service");

const mockUser: UserData = {
  target: "fake",
  username: "test",
  password: "password",
};

beforeAll(() => {
  init();

  (validateToken as jest.Mock).mockImplementation((header) => {
    if (header === "Bearer xyz") {
      return mockUser;
    } else {
      throw new AppError("Unauthorized", 401);
    }
  });
});

const noop = () => {
  // DO nothing
};

function createRequest(
  queryParams?: unknown,
  body?: unknown,
  authorization?: string,
): Request {
  const req: Request = {
    query: queryParams,
    body: body,
    header: jest.fn().mockReturnValue(authorization),
  } as unknown as Request;
  return req;
}

function createResponse(): Response {
  const res: Response = {
    statusCode: 200,
    status: (code: number) => {
      res.statusCode = code;
      return res;
    },
    send: jest.fn().mockImplementation(),
  } as unknown as Response;
  return res;
}

describe("handle", () => {
  it("should handle requests", async () => {
    const queryParams = {
      field1: "abc",
    };
    const expectedReturn = {
      test: "value",
    };
    const controller = jest.fn().mockReturnValue(expectedReturn);

    const req = createRequest(queryParams);
    const res = createResponse();
    await handle(controller)(req, res, noop);

    expect(controller).toHaveBeenCalledWith(undefined, queryParams, undefined);
    expect(res.statusCode).toBe(200);
    expect(res.send).toHaveBeenCalledWith(expectedReturn);
  });

  it("should handle validations on requests", async () => {
    const controller = jest.fn().mockImplementation(() => {
      throw new AppError("Bad request", 400);
    });

    const req = createRequest();
    const res = createResponse();
    await handle(controller)(req, res, noop);

    expect(controller).toHaveBeenCalled();
    expect(res.statusCode).toBe(400);
    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.any(String),
      }),
    );
  });

  it("should handle generic errors on requests", async () => {
    const controller = jest.fn().mockImplementation(() => {
      throw new Error();
    });

    const req = createRequest();
    const res = createResponse();
    await handle(controller)(req, res, noop);

    expect(controller).toHaveBeenCalled();
    expect(res.statusCode).toBe(500);
    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.any(String),
      }),
    );
  });

  it("should handle unexpected errors on requests", async () => {
    const controller = jest.fn().mockImplementation(() => {
      throw {};
    });

    const req = createRequest();
    const res = createResponse();
    await handle(controller)(req, res, noop);

    expect(controller).toHaveBeenCalled();
    expect(res.statusCode).toBe(500);
    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.any(String),
      }),
    );
  });
});

describe("authenticate", () => {
  it("should authenticate requests", async () => {
    const authorization = "Bearer xyz";

    const req = createRequest(undefined, undefined, authorization);
    const res = createResponse();
    const next = jest.fn();
    await authenticate(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toBe(mockUser);
  });

  it("should detect missing/wrong Authorization header on GET requests", async () => {
    const authorization = "Bearer 123";

    const req = createRequest(undefined, undefined, authorization);
    const res = createResponse();
    const next = jest.fn();
    await authenticate(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(401);
    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.any(String),
      }),
    );
  });
});
