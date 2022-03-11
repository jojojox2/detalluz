import { Handler } from "@netlify/functions";
import { get } from "./common/rest";
import { charges } from "./prices/prices.controller";

export const handler: Handler = get(charges);
