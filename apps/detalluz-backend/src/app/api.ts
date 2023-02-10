import { Request, Response, Router } from "express";
import { authenticate, handle } from "./common/rest";
import { configuration } from "./configuration/configuration.controller";
import { consumption } from "./consumption/consumption.controller";
import { contracts } from "./contracts/contracts.controller";
import { login } from "./login/login.controller";
import { charges, prices } from "./prices/prices.controller";

export const api = Router();

api.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Detalluz API");
});

api.get("/prices", handle(prices));
api.get("/charges", handle(charges));

api.get("/configuration", handle(configuration));

api.post("/token", handle(login));
api.get("/contracts", authenticate, handle(contracts));
api.get("/consumption", authenticate, handle(consumption));
