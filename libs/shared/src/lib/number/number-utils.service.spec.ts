import { DecimalPipe } from "@angular/common";
import { TestBed } from "@angular/core/testing";
import { NumberUtilsService } from "./number-utils.service";

describe("NumberUtilsService", () => {
  let service: NumberUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DecimalPipe],
    });
    service = TestBed.inject(NumberUtilsService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("formatNumber", () => {
    it("should format a defined number", () => {
      expect(service.formatNumber(1.23, "1.2-2")).toBe("1.23");
    });

    it("should format a number with default format", () => {
      expect(service.formatNumber(1.23)).toBeDefined();
    });

    it("should set a placeholder for undefined values", () => {
      expect(service.formatNumber(undefined)).toBe("-");
    });
  });

  describe("formatNumberWithUnit", () => {
    it("should format a defined number with a unit", () => {
      expect(service.formatNumberWithUnit(1.23, "X", "1.2-2")).toBe("1.23 X");
    });

    it("should format a defined number and unit with default numberformat", () => {
      expect(service.formatNumberWithUnit(1.23, "X")).toBeDefined();
    });
  });

  describe("roundNumber", () => {
    it("should round a number upwards", () => {
      expect(service.roundNumber(1.236, 2)).toBe(1.24);
    });
    it("should round a number downwards", () => {
      expect(service.roundNumber(1.234, 2)).toBe(1.23);
    });
    it("should allow a default digits value", () => {
      expect(service.roundNumber(1.23)).toBeDefined();
    });
  });
});
