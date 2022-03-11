import { validateToken } from "./auth.service";
import { AppError } from "./error";
import { get, getAuthenticated, init, post, postAuthenticated } from "./rest";

jest.mock("./auth.service");

beforeAll(() => {
  init();

  (validateToken as jest.Mock).mockImplementation((header) => {
    if (header === "Bearer xyz") {
      return {
        username: "test",
        password: "password",
      };
    } else {
      throw new AppError("Unauthorized", 401);
    }
  });
});

const BASIC_EVENT = {
  rawUrl: "",
  rawQuery: "",
  path: "",
  httpMethod: "",
  headers: {},
  multiValueHeaders: {},
  queryStringParameters: {},
  multiValueQueryStringParameters: null,
  body: null,
  isBase64Encoded: false,
};

const noop = () => {
  // DO nothing
};

const BASIC_CONTEXT = {
  callbackWaitsForEmptyEventLoop: false,
  functionName: "",
  functionVersion: "",
  invokedFunctionArn: "",
  memoryLimitInMB: "",
  awsRequestId: "",
  logGroupName: "",
  logStreamName: "",
  getRemainingTimeInMillis: () => 1,
  done: noop,
  fail: noop,
  succeed: noop,
};

describe("get", () => {
  it("should accept GET requests", async () => {
    const controller = jest.fn().mockReturnValue({});
    const handler = get(controller);

    const response = await handler(
      {
        ...BASIC_EVENT,
        httpMethod: "GET",
        queryStringParameters: {
          field1: "abc",
        },
      },
      BASIC_CONTEXT,
      noop,
    );

    expect(controller).toHaveBeenCalledWith(
      expect.objectContaining({
        field1: "abc",
      }),
      undefined,
    );
    expect(response).toBeDefined();
    expect(response?.statusCode).toBe(200);
  });

  it("should handle validations on GET requests", async () => {
    const controller = jest.fn().mockImplementation(() => {
      throw new AppError("Bad request", 400);
    });
    const handler = get(controller);

    const response = await handler(
      {
        ...BASIC_EVENT,
        httpMethod: "GET",
      },
      BASIC_CONTEXT,
      noop,
    );

    expect(controller).toHaveBeenCalled();
    expect(response).toBeDefined();
    expect(response?.statusCode).toBe(400);
  });

  it("should handle generic errors on GET requests", async () => {
    const controller = jest.fn().mockImplementation(() => {
      throw new Error();
    });
    const handler = get(controller);

    const response = await handler(
      {
        ...BASIC_EVENT,
        httpMethod: "GET",
      },
      BASIC_CONTEXT,
      noop,
    );

    expect(controller).toHaveBeenCalled();
    expect(response).toBeDefined();
    expect(response?.statusCode).toBe(500);
  });

  it("should handle unexpected errors on GET requests", async () => {
    const controller = jest.fn().mockImplementation(() => {
      throw {};
    });
    const handler = get(controller);

    const response = await handler(
      {
        ...BASIC_EVENT,
        httpMethod: "GET",
      },
      BASIC_CONTEXT,
      noop,
    );

    expect(controller).toHaveBeenCalled();
    expect(response).toBeDefined();
    expect(response?.statusCode).toBe(500);
  });

  it("should accept GET requests with authentication", async () => {
    const controller = jest.fn().mockReturnValue("{abc}");
    const handler = getAuthenticated(controller);

    const response = await handler(
      {
        ...BASIC_EVENT,
        httpMethod: "GET",
        queryStringParameters: {
          field1: "abc",
        },
        headers: {
          authorization: "Bearer xyz",
        },
      },
      BASIC_CONTEXT,
      noop,
    );

    expect(controller).toHaveBeenCalledWith(
      expect.objectContaining({
        username: "test",
      }),
      expect.objectContaining({
        field1: "abc",
      }),
    );
    expect(response).toBeDefined();
    expect(response?.statusCode).toBe(200);
  });

  it("should detect missing/wrong Authorization header on GET requests", async () => {
    const controller = jest.fn();
    const handler = getAuthenticated(controller);

    const response = await handler(
      {
        ...BASIC_EVENT,
        httpMethod: "GET",
        queryStringParameters: {
          field1: "abc",
        },
        headers: {
          authorization: "Bearer 123",
        },
      },
      BASIC_CONTEXT,
      noop,
    );

    expect(controller).not.toHaveBeenCalled();
    expect(response).toBeDefined();
    expect(response?.statusCode).toBe(401);
  });

  it("should validate HTTP method on GET requests", async () => {
    const controller = jest.fn();
    const handler = get(controller);

    const response = await handler(
      {
        ...BASIC_EVENT,
        httpMethod: "DELETE",
      },
      BASIC_CONTEXT,
      noop,
    );

    expect(controller).not.toHaveBeenCalled();
    expect(response).toBeDefined();
    expect(response?.statusCode).toBe(405);
  });
});

describe("post", () => {
  it("should accept POST requests", async () => {
    const controller = jest.fn().mockReturnValue(123);
    const handler = post(controller);

    const response = await handler(
      {
        ...BASIC_EVENT,
        httpMethod: "POST",
        queryStringParameters: {
          field1: "abc",
        },
        body: `{
                    "field2": "123"
                }`,
      },
      BASIC_CONTEXT,
      noop,
    );

    expect(controller).toHaveBeenCalledWith(
      expect.objectContaining({
        field2: "123",
      }),
      expect.objectContaining({
        field1: "abc",
      }),
      undefined,
    );
    expect(response).toBeDefined();
    expect(response?.statusCode).toBe(200);
  });

  it("should accept POST requests with authentication", async () => {
    const controller = jest.fn();
    const handler = postAuthenticated(controller);

    const response = await handler(
      {
        ...BASIC_EVENT,
        httpMethod: "POST",
        queryStringParameters: {
          field1: "abc",
        },
        body: `{
                    "field2": "123"
                }`,
        headers: {
          authorization: "Bearer xyz",
        },
      },
      BASIC_CONTEXT,
      noop,
    );

    expect(controller).toHaveBeenCalledWith(
      expect.objectContaining({
        username: "test",
      }),
      expect.objectContaining({
        field2: "123",
      }),
      expect.objectContaining({
        field1: "abc",
      }),
    );
    expect(response).toBeDefined();
    expect(response?.statusCode).toBe(200);
  });

  it("should validate the request body", async () => {
    const controller = jest.fn();
    const handler = post(controller);

    const response = await handler(
      {
        ...BASIC_EVENT,
        httpMethod: "POST",
        queryStringParameters: {
          field1: "abc",
        },
        body: `{
                    invalid json
                }`,
      },
      BASIC_CONTEXT,
      noop,
    );

    expect(controller).not.toHaveBeenCalled();
    expect(response).toBeDefined();
    expect(response?.statusCode).toBe(422);
  });
});
