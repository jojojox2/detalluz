import { Handler } from "@netlify/functions";
import { post } from "./common/rest";
import { login } from "./login/login.controller";

export const handler: Handler = post(login);
