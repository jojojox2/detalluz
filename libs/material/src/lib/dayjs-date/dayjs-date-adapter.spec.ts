import { TestBed } from "@angular/core/testing";
import { DateAdapter, MAT_DATE_LOCALE } from "@angular/material/core";
import { DateFormats } from "@detalluz/shared";
import dayjs, { Dayjs } from "dayjs";
import { DateFormatStyle } from "./dayjs-date-adapter";
import { MatDayjsDateModule } from "./dayjs-date-adapter.module";

describe("DayjsDateAdapter", () => {
  let adapter: DateAdapter<Dayjs>;
  let testDate: Dayjs;
  const styles: DateFormatStyle[] = ["long", "short", "narrow"];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatDayjsDateModule],
      providers: [{ provide: MAT_DATE_LOCALE, useValue: "en" }],
    });
    adapter = TestBed.inject(DateAdapter);
    testDate = dayjs("2020-12-31", "YYYY-MM-DD");
  });

  it("should be created", () => {
    expect(adapter).toBeTruthy();
  });

  describe("get info from a date", () => {
    it("should retrieve the correct year of a date", () => {
      const year = adapter.getYear(testDate);

      expect(year).toBeDefined();
      expect(year).toBe(2020);
    });

    it("should retrieve the correct month of a date", () => {
      const month = adapter.getMonth(testDate);

      expect(month).toBeDefined();
      expect(month).toBe(11); // 11 = December
    });

    it("should retrieve the correct day of a date", () => {
      const date = adapter.getDate(testDate);

      expect(date).toBeDefined();
      expect(date).toBe(31);
    });

    it("should retrieve the correct day of week of a date", () => {
      const dayOfWeek = adapter.getDayOfWeek(testDate);

      expect(dayOfWeek).toBeDefined();
      expect(dayOfWeek).toBe(4); // 4 = Thursday
    });

    it("should retrieve the full year format of a date", () => {
      const year = adapter.getYearName(testDate);

      expect(year).toBeDefined();
      expect(year).toBe("2020");
    });

    it("should get the number of days in the month of a date", () => {
      const numDays = adapter.getNumDaysInMonth(testDate);

      expect(numDays).toBeDefined();
      expect(numDays).toBe(31);
    });
  });

  describe("get names", () => {
    test.each(styles)(
      "should retrieve a list of month names with %p style",
      (style) => {
        const list = adapter.getMonthNames(style);

        expect(list).toBeDefined();
        expect(list.length).toBe(12);
      },
    );

    test.each(styles)(
      "should retrieve a list of day of week names with %p style",
      (style) => {
        const list = adapter.getDayOfWeekNames(style);

        expect(list).toBeDefined();
        expect(list.length).toBe(7);
      },
    );

    it("should retrieve a list with the number of the days", () => {
      const list = adapter.getDateNames();

      expect(list).toBeDefined();
      expect(list.length).toBe(31);
    });

    it("should retrieve the first day of a week", () => {
      const firstDay = adapter.getFirstDayOfWeek();

      expect(firstDay).toBeDefined();
      expect(firstDay).toBeGreaterThanOrEqual(0);
      expect(firstDay).toBeLessThan(7);
    });
  });

  it("should clone a date", () => {
    const newDate = adapter.clone(testDate);

    expect(newDate).toBeDefined();
    expect(newDate.isValid()).toBeTruthy();
    expect(newDate).not.toEqual(testDate);
    expect(newDate.format(DateFormats.ISO)).toBe(
      testDate.format(DateFormats.ISO),
    );
  });

  it("should create a new date", () => {
    const date = adapter.createDate(2020, 11, 31);

    expect(date).toBeDefined();
    expect(date.isValid()).toBeTruthy();
    expect(date.format(DateFormats.ISO_LOCALDATE)).toBe("2020-12-31");
  });

  it("should get today's date", () => {
    const date = adapter.today();

    expect(date).toBeDefined();
    expect(date.isValid()).toBeTruthy();
    expect(date.diff(new Date(), "day")).toBe(0);
  });

  it("should parse a date input", () => {
    const date = adapter.parse("31/12/2020", "DD/MM/YYYY");

    expect(date).toBeDefined();
    expect(date?.isValid()).toBeTruthy();
    expect(date?.format("YYYY-MM-DD")).toBe("2020-12-31");
  });

  it("should format a date", () => {
    const formatted = adapter.format(testDate, "DD/MM/YYYY");

    expect(formatted).toBeDefined();
    expect(formatted).toBe("31/12/2020");
  });

  describe("date manipulation", () => {
    it("should add years to a date", () => {
      const newDate = adapter.addCalendarYears(testDate, 1);

      expect(newDate).toBeDefined();
      expect(newDate.isValid).toBeTruthy();
      expect(newDate.diff(testDate, "year")).toBe(1);
    });

    it("should add months to a date", () => {
      const newDate = adapter.addCalendarMonths(testDate, 1);

      expect(newDate).toBeDefined();
      expect(newDate.isValid).toBeTruthy();
      expect(newDate.diff(testDate, "month")).toBe(1);
    });

    it("should add days to a date", () => {
      const newDate = adapter.addCalendarDays(testDate, 1);

      expect(newDate).toBeDefined();
      expect(newDate.isValid).toBeTruthy();
      expect(newDate.diff(testDate, "day")).toBe(1);
    });
  });

  it("should convert a date to ISO-8601", () => {
    const isoDate = adapter.toIso8601(testDate);

    expect(isoDate).toBeDefined();
    expect(
      /^\d{4}-\d{2}-\d{2}[tT]\d{2}:\d{2}:\d{2}(.\d*)?([zZ]|([\\+-])(\d{2})(:?(\d{2}))?)?$/.test(
        isoDate,
      ),
    ).toBeTruthy();
  });

  describe("deserialization", () => {
    it("should deserialize from a string in ISO format", () => {
      const date = adapter.deserialize("2020-12-31T00:00:00.000Z");

      expect(date).toBeDefined();
      expect(date?.isValid()).toBeTruthy();
    });

    it("should deserialize from a native Date", () => {
      const date = adapter.deserialize(new Date());

      expect(date).toBeDefined();
      expect(date?.isValid()).toBeTruthy();
    });

    it("should deserialize from a Dayjs object", () => {
      const date = adapter.deserialize(dayjs());

      expect(date).toBeDefined();
      expect(date?.isValid()).toBeTruthy();
    });

    it("should not deserialize from other format", () => {
      const date = adapter.deserialize(0);

      expect(date).toBeDefined();
      expect(date?.isValid()).toBeFalsy();
    });
  });
});
