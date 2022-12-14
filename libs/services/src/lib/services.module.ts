import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";

export { AuthService, TOKEN_STORAGE_KEY } from "./auth/auth.service";
export { TokenService } from "./auth/token.service";
export { ChargesService } from "./charges/charges.service";
export { ConfigurationService } from "./configuration/configuration.service";
export { ContractsService } from "./contracts/contracts.service";
export { ConsumptionService } from "./consumption/consumption.service";
export { PricesService } from "./prices/prices.service";

@NgModule({
  imports: [HttpClientModule],
})
export class ServicesModule {}
