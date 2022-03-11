import { Handler, HandlerResponse } from "@netlify/functions";
import { Event } from "@netlify/functions/dist/function/event";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/es";
import { validateToken } from "./auth.service";
import { AppError } from "./error";
import { Message, UserData } from "@detalluz/api";

export function get<P, R>(
  controller: (queryParams?: P, user?: UserData) => R,
  authenticate = false,
): Handler {
  return RestHandler((event) => {
    validateHttpMethod(event.httpMethod, "GET");

    const params: P = getParams(event.queryStringParameters);

    return controller(params, authenticate ? validateAuth(event) : undefined);
  });
}

export function post<P, B, R>(
  controller: (body?: B, queryParams?: P, user?: UserData) => R,
  authenticate = false,
): Handler {
  return RestHandler((event) => {
    validateHttpMethod(event.httpMethod, "POST");

    const params: P = getParams(event.queryStringParameters);
    const body: B = getParams(event.body);

    return controller(
      body,
      params,
      authenticate ? validateAuth(event) : undefined,
    );
  });
}

export function getAuthenticated<P, R>(
  controller: (user: UserData, queryParams?: P) => R,
): Handler {
  return get((queryParams?: P, user?: UserData) => {
    return controller(<UserData>user, queryParams);
  }, true);
}

export function postAuthenticated<P, B, R>(
  controller: (user: UserData, body?: B, queryParams?: P) => R,
): Handler {
  return post((body?: B, queryParams?: P, user?: UserData) => {
    return controller(<UserData>user, body, queryParams);
  }, true);
}

export function init(): void {
  dayjs.extend(customParseFormat);
  dayjs.locale("es");
  dayjs.extend(utc);
  dayjs.extend(timezone);
}

function RestHandler<R>(fn: (event: Event) => R): Handler {
  const handler: Handler = async (event) => {
    try {
      init();

      return RestResponse(await fn(event));
    } catch (error: unknown) {
      return processError(error);
    }
  };

  return handler;
}

function validateAuth(event: Event): UserData {
  return validateToken(event.headers["authorization"]);
}

function RestResponse(body: unknown, statusCode = 200): HandlerResponse {
  const responseBody = JSON.stringify(body);

  const response: HandlerResponse = {
    statusCode: statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: responseBody,
  };

  return response;
}

function RestErrorResponse(
  body: Message | string = "Internal error",
  statusCode = 500,
): HandlerResponse {
  let responseBody = body;

  if (typeof responseBody === "string") {
    responseBody = {
      message: responseBody,
    };
  }

  return RestResponse(responseBody, statusCode);
}

function validateHttpMethod(current: string, valid: string | string[]): void {
  const validHttpMethods = Array.isArray(valid) ? valid : [valid];

  if (!validHttpMethods.includes(current)) {
    throw new AppError("Method not allowed", 405);
  }
}

function getParams<T>(input: unknown): T {
  let inputObject = input;

  if (isString(inputObject)) {
    try {
      inputObject = JSON.parse(<string>inputObject);
    } catch {
      throw new AppError("Unprocessable request", 422);
    }
  }

  const params = <T>{
    ...(<object>inputObject),
  };

  return params;
}

function processError(error: AppError | Error | unknown): HandlerResponse {
  console.log("*** ERROR ON REQUEST ***");

  if (error instanceof AppError) {
    console.error("AppError", error);
    return RestErrorResponse(error.response, error.statusCode);
  } else if (error instanceof Error) {
    console.error(error);
    return RestErrorResponse(error.message);
  } else {
    return RestErrorResponse();
  }
}

function isString(value: string | unknown): boolean {
  return typeof value === "string" || value instanceof String;
}
