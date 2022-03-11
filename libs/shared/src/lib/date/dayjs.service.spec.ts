import { TestBed } from "@angular/core/testing";
import { DateFormats, DayjsService } from "./dayjs.service";

describe("DayjsService", () => {
  let service: DayjsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DayjsService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should create a new date from a string", () => {
    const date = service.new("2020-12-31", "YYYY-MM-DD");

    expect(date).toBeDefined();
    expect(date.isValid()).toBeTruthy();
  });

  it("should be able to use UTC configuration", () => {
    service.config({ utc: true });
    const date = service.new();

    expect(date).toBeDefined();
    expect(date.isValid()).toBeTruthy();
    expect(date.format(DateFormats.ISO)).toBe(
      date.utc().format(DateFormats.ISO),
    );
  });

  it("should be able to create new strings with custom configuration", () => {
    const date = service.new("20201231", undefined, "en", false);

    expect(date).toBeDefined();
    expect(date.isValid()).toBeTruthy();
    expect(date.format(DateFormats.ISO_LOCALDATE)).toBe("2020-12-31");
  });

  it("should create a new date without specific time", () => {
    const date = service.create(2020, 11, 31);

    expect(date).toBeDefined();
    expect(date.isValid()).toBeTruthy();
    expect(date.format(DateFormats.ISO_LOCALDATE)).toBe("2020-12-31");
  });

  it("should be able to get the current time", () => {
    const date = service.now();

    expect(date).toBeDefined();
    expect(date.isValid()).toBeTruthy();
    expect(date.diff(new Date(), "minute")).toBe(0); // Tolerate a < 1 min diff for testing purposes
  });

  it("should be able to get the current date", () => {
    const date = service.today();

    expect(date).toBeDefined();
    expect(date.isValid()).toBeTruthy();
    expect(date.diff(new Date(), "day")).toBe(0);
  });

  it("should format dates", () => {
    const date = service.new("31/12/2020", "DD/MM/YYYY");

    const formatted = service.format(date, "YYYY-MM-DD");

    expect(formatted).toBeDefined();
    expect(formatted).toBe("2020-12-31");
  });

  it("should throw an error when formatting an invalid date", () => {
    const date = service.new(null);

    expect(date.isValid()).toBeFalsy();
    expect(() => {
      service.format(date, "YYYY-MM-DD");
    }).toThrowError();
  });

  it("should parse a date from string with format", () => {
    const parsed = service.parse("31/12/2020", "DD/MM/YYYY");

    expect(parsed).toBeDefined();
    expect(parsed?.isValid()).toBeTruthy();
  });

  it("should not parse an empty date", () => {
    const parsed = service.parse(null);

    expect(parsed).toBeNull();
  });

  it("should parse a date from native Date", () => {
    const parsed = service.parse(new Date());

    expect(parsed).toBeDefined();
    expect(parsed?.isValid()).toBeTruthy();
  });
});
