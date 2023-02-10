import { validateToken } from "./auth.service";
import { AppError } from "./error";
import { Message, UserData } from "@detalluz/api";
import { NextFunction, Request, RequestHandler, Response } from "express";

export function handle<P, B, R>(
  controller: (user?: UserData, queryParams?: P, body?: B) => R,
): RequestHandler<unknown, R, B, P> {
  return async (req: Request<unknown, R, B, P>, res: Response<R>) => {
    try {
      const user: UserData | undefined = req.user;
      const params: P = req.query;
      const body: B = req.body;

      const result: R = await controller(user, params, body);

      res.send(result);
    } catch (error: unknown) {
      processError(res, error);
    }
  };
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    req.user = validateToken(req.header("authorization"));
    next();
  } catch (error: unknown) {
    processError(res, error);
  }
}

function processError(res: Response, error: AppError | Error | unknown): void {
  if (error instanceof AppError) {
    console.error("AppError", error);
    sendErrorResponse(res, error.response, error.statusCode);
  } else if (error instanceof Error) {
    console.error(error);
    sendErrorResponse(res, error.message);
  } else {
    sendErrorResponse(res);
  }
}

function sendErrorResponse(
  res: Response,
  body: Message | string = "Internal error",
  statusCode = 500,
): void {
  let responseBody = body;

  if (typeof responseBody === "string") {
    responseBody = {
      message: responseBody,
    };
  }

  res.status(statusCode).send(responseBody);
}
