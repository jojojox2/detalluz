import { Inject, Injectable, Optional, InjectionToken } from "@angular/core";
import { DateAdapter, MAT_DATE_LOCALE } from "@angular/material/core";
import dayjs, { Dayjs } from "dayjs";
import { DateFormats, DayjsService } from "@detalluz/shared";

/** Configurable options for {@see DayjsDateAdapter}. */
export interface DayjsDateAdapterOptions {
  /**
   * When enabled, the dates have to match the format exactly.
   * See https://day.js.org/docs/en/plugin/custom-parse-format.
   */
  strict?: boolean;

  /**
   * Turns the use of utc dates on or off.
   * Changing this will change how Angular Material components like DatePicker output dates.
   */
  useUtc?: boolean;
}

/** InjectionToken for Day.js date adapter to configure options. */
export const DAYJS_DATE_ADAPTER_OPTIONS =
  new InjectionToken<DayjsDateAdapterOptions>("DAYJS_DATE_ADAPTER_OPTIONS", {
    providedIn: "root",
    factory: DAYJS_DATE_ADAPTER_OPTIONS_FACTORY,
  });

function DAYJS_DATE_ADAPTER_OPTIONS_FACTORY(): DayjsDateAdapterOptions {
  return {
    strict: true,
    useUtc: false,
  };
}

export type DateFormatStyle = "long" | "short" | "narrow";

/** Creates an array and fills it with values. */
function range<T>(length: number, valueFunction: (index: number) => T): T[] {
  const valuesArray = Array(length);
  for (let i = 0; i < length; i++) {
    valuesArray[i] = valueFunction(i);
  }
  return valuesArray;
}

/** Adapts Day.js Dates for use with Angular Material. */
@Injectable()
export class DayjsDateAdapter extends DateAdapter<Dayjs> {
  private localeData!: {
    firstDayOfWeek: number;
    longMonths: string[];
    shortMonths: string[];
    dates: string[];
    longDaysOfWeek: string[];
    shortDaysOfWeek: string[];
    narrowDaysOfWeek: string[];
  };

  constructor(
    private dayjsService: DayjsService,
    @Optional() @Inject(MAT_DATE_LOCALE) dateLocale: string,
    @Optional()
    @Inject(DAYJS_DATE_ADAPTER_OPTIONS)
    private options?: DayjsDateAdapterOptions,
  ) {
    super();

    const { useUtc, strict }: DayjsDateAdapterOptions = this.options || {};

    this.dayjsService.config({
      locale: dateLocale,
      utc: useUtc,
      strict: strict,
    });

    this.setLocale(dateLocale);
  }

  override setLocale(locale: string) {
    super.setLocale(locale);

    const dayjsLocaleData = this.dayjsService.new().localeData();
    this.localeData = {
      firstDayOfWeek: dayjsLocaleData.firstDayOfWeek(),
      longMonths: dayjsLocaleData.months(),
      shortMonths: dayjsLocaleData.monthsShort(),
      dates: range(31, (i) => this.createDate(2017, 0, i + 1).format("D")),
      longDaysOfWeek: dayjsLocaleData.weekdays(),
      shortDaysOfWeek: dayjsLocaleData.weekdaysShort(),
      narrowDaysOfWeek: dayjsLocaleData.weekdaysMin(),
    };
  }

  getYear(date: Dayjs): number {
    return date.year();
  }

  getMonth(date: Dayjs): number {
    return date.month();
  }

  getDate(date: Dayjs): number {
    return date.date();
  }

  getDayOfWeek(date: Dayjs): number {
    return date.day();
  }

  getMonthNames(style: DateFormatStyle): string[] {
    switch (style) {
      case "long":
        return this.localeData.longMonths;
      case "short":
      case "narrow":
        return this.localeData.shortMonths;
    }
  }

  getDateNames(): string[] {
    return this.localeData.dates;
  }

  getDayOfWeekNames(style: DateFormatStyle): string[] {
    switch (style) {
      case "long":
        return this.localeData.longDaysOfWeek;
      case "short":
        return this.localeData.shortDaysOfWeek;
      case "narrow":
        return this.localeData.narrowDaysOfWeek;
    }
  }

  getYearName(date: Dayjs): string {
    return date.format("YYYY");
  }

  getFirstDayOfWeek(): number {
    return this.localeData.firstDayOfWeek;
  }

  getNumDaysInMonth(date: Dayjs): number {
    return date.daysInMonth();
  }

  clone(date: Dayjs): Dayjs {
    return date.clone();
  }

  createDate(year: number, month: number, date: number): Dayjs {
    return this.dayjsService.create(year, month, date);
  }

  today(): Dayjs {
    return this.dayjsService.today();
  }

  parse(
    value: string | number | Dayjs | Date | null | undefined,
    parseFormat: string | string[],
    strict?: boolean,
  ): Dayjs | null {
    return this.dayjsService.parse(value, parseFormat, strict);
  }

  format(date: Dayjs, displayFormat: string): string {
    return this.dayjsService.format(date, displayFormat);
  }

  addCalendarYears(date: Dayjs, years: number): Dayjs {
    return date.add(years, "year");
  }

  addCalendarMonths(date: Dayjs, months: number): Dayjs {
    return date.add(months, "month");
  }

  addCalendarDays(date: Dayjs, days: number): Dayjs {
    return date.add(days, "day");
  }

  toIso8601(date: Dayjs): string {
    return date.toISOString();
  }

  override deserialize(
    value: string | number | Dayjs | Date | null | undefined,
  ): Dayjs | null {
    let date;
    if (value instanceof Date) {
      date = this.dayjsService.new(value);
    } else if (this.isDateInstance(value)) {
      date = this.clone(<Dayjs>value);
    }
    if (typeof value === "string") {
      date = this.parse(value, DateFormats.ISO, false); // Non-strict due to Day.js bug parse with timezones
    }
    if (date && this.isValid(date)) {
      return date;
    }
    return super.deserialize(value);
  }

  isDateInstance(
    obj: string | number | Dayjs | Date | null | undefined,
  ): boolean {
    return dayjs.isDayjs(obj);
  }

  isValid(date: Dayjs): boolean {
    return date.isValid();
  }

  invalid(): Dayjs {
    return this.dayjsService.new(null);
  }
}
