import { Message } from "@detalluz/api";

export class AppError {
  statusCode = 500;
  response: Message = {
    message: "Internal error",
  };

  constructor(message?: string, statusCode?: number, errors?: string[]) {
    if (message) {
      this.response = {
        message: message,
        errors: errors,
      };
    }

    if (statusCode) {
      this.statusCode = statusCode;
    }
  }
}
