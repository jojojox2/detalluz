import { Inject, Injectable, LOCALE_ID } from "@angular/core";
import { LocalizeFn } from "@angular/localize/init";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import advancedFormat from "dayjs/plugin/advancedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localeData from "dayjs/plugin/localeData";
import localizedFormat from "dayjs/plugin/localizedFormat";
import timezone from "dayjs/plugin/timezone";

import "dayjs/locale/es";

declare const $localize: LocalizeFn;

export interface DayjsConfig {
  locale?: string;
  utc?: boolean;
  strict?: boolean;
}

export const DateFormats = {
  ISO: "YYYY-MM-DDTHH:mm:ss.SSSZ",
  ISO_LOCALDATE: "YYYY-MM-DD",
  HOUR_WITH_TIMEZONE: "HH:mmZ",
  NUMBERED_DAY: "YYYYMMDD",
};

export const DEFAULT_TIMEZONE = "Europe/Madrid";

@Injectable({
  providedIn: "root",
})
export class DayjsService {
  private configData: DayjsConfig = {
    locale: "en",
    utc: false,
    strict: true,
  };

  constructor(@Inject(LOCALE_ID) private localeId: string) {
    dayjs.locale(localeId);
    dayjs.extend(localeData);
    dayjs.extend(customParseFormat);
    dayjs.extend(localizedFormat);
    dayjs.extend(advancedFormat);
    dayjs.extend(utc);
    dayjs.extend(timezone);
  }

  public config(config: DayjsConfig) {
    Object.entries(config)
      .filter(([, value]) => typeof value !== "undefined")
      .map(([key, value]) => {
        this.configData[<keyof DayjsConfig>key] = value;
      });
  }

  new(
    date?: string | number | Dayjs | Date | null | undefined,
    format?: string | string[],
    locale?: string,
    strict?: boolean,
  ): Dayjs {
    const dayjsDate = dayjs(
      date,
      format,
      locale || this.configData.locale,
      typeof strict === "undefined" ? this.configData.strict : strict,
    );

    return this.configData.utc
      ? dayjsDate.utc()
      : dayjsDate.tz(DEFAULT_TIMEZONE);
  }

  now(): Dayjs {
    return this.new();
  }

  today(): Dayjs {
    return this.now().hour(0).minute(0).second(0).millisecond(0);
  }

  create(
    year: number,
    month: number,
    date: number,
    hour?: number,
    minute?: number,
    second?: number,
    millisecond?: number,
  ): Dayjs {
    return this.new()
      .year(year)
      .month(month)
      .date(date)
      .hour(hour || 0)
      .minute(minute || 0)
      .second(second || 0)
      .millisecond(millisecond || 0);
  }

  format(date: Dayjs, displayFormat: string): string {
    if (!date || !date.isValid()) {
      throw Error($localize`:@@dayjs.cannot-format:Cannot format invalid date`);
    }
    return date.format(displayFormat);
  }

  parse(
    value: string | number | Dayjs | Date | null | undefined,
    parseFormat?: string | string[],
    strict?: boolean,
  ): Dayjs | null {
    if (!value) {
      return null;
    }

    if (typeof value === "string" && parseFormat) {
      return this.new(value, parseFormat, undefined, strict);
    }

    return this.new(value);
  }
}
