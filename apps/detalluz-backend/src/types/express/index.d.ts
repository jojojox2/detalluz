import { UserData } from "@detalluz/api";

export {};

declare global {
  namespace Express {
    export interface Request {
      user?: UserData;
    }
  }
}
