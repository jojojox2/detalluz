import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/es";

export function init(): void {
  dayjs.extend(customParseFormat);
  dayjs.locale("es");
  dayjs.extend(utc);
  dayjs.extend(timezone);
}
