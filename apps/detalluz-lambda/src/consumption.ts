import { Handler } from "@netlify/functions";
import { getAuthenticated } from "./common/rest";
import { consumption } from "./consumption/consumption.controller";

export const handler: Handler = getAuthenticated(consumption);
