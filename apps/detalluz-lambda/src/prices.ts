import { Handler } from "@netlify/functions";
import { get } from "./common/rest";
import { prices } from "./prices/prices.controller";

export const handler: Handler = get(prices);
