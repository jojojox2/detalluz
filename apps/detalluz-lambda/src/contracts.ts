import { Handler } from "@netlify/functions";
import { getAuthenticated } from "./common/rest";
import { contracts } from "./contracts/contracts.controller";

export const handler: Handler = getAuthenticated(contracts);
