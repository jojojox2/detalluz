import { Handler } from "@netlify/functions";
import { get } from "./common/rest";
import { configuration } from "./configuration/configuration.controller";

export const handler: Handler = get(configuration);
