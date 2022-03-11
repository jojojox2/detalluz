import { Handler } from "@netlify/functions";
import { post } from "./common/rest";
import { login } from "./consumption/consumption.controller";

export const handler: Handler = post(login);
