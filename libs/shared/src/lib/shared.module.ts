import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

export {
  DayjsService,
  DateFormats,
  DEFAULT_TIMEZONE,
} from "./date/dayjs.service";

export { NumberUtilsService } from "./number/number-utils.service";

@NgModule({
  imports: [CommonModule],
})
export class SharedModule {}
