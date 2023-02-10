import { AppError } from "./error";
import { init } from "./config";
import { validate, validateDateRange, Validations } from "./validations";

beforeAll(() => {
  init();
});

describe("Validations", () => {
  it("should validate required parameters", async () => {
    expect(Validations.required("key", "value")).toBeNull();

    expect(Validations.required("key", undefined)).toBeDefined();
  });

  it("should validate regexp patterns", async () => {
    const pattern = /^[\d]{4}$/;

    expect(Validations.pattern(pattern)("key", undefined)).toBeNull();
    expect(Validations.pattern(pattern)("key", "1234")).toBeNull();

    expect(Validations.pattern(pattern)("key", "123")).toBeDefined();
  });

  it("should validate string patterns", async () => {
    const pattern = "^[\\d]{4}$";

    expect(Validations.pattern(pattern)("key", undefined)).toBeNull();
    expect(Validations.pattern(pattern)("key", "1234")).toBeNull();

    expect(Validations.pattern(pattern)("key", "123")).toBeDefined();
  });

  it("should validate dates", async () => {
    expect(Validations.date("key", undefined)).toBeNull();
    expect(Validations.date("key", "2021-12-31")).toBeNull();

    expect(Validations.date("key", "2021-31-12")).toBeDefined();
    expect(Validations.date("key", "20210101")).toBeDefined();
    expect(Validations.date("key", "01/01/2021")).toBeDefined();
    expect(Validations.date("key", "2021-02-29")).toBeDefined();
  });

  it("should validate that a date is not before another one", async () => {
    expect(
      Validations.dateNotBefore("2021-01-15")("key", undefined),
    ).toBeNull();
    expect(
      Validations.dateNotBefore(null, "anotherKey")("key", "2021-01-01"),
    ).toBeNull();

    expect(
      Validations.dateNotBefore("15012021", "anotherKey")("key", "2021-01-01"),
    ).toBeNull();
    expect(
      Validations.dateNotBefore("2021-01-15", "anotherKey")(
        "key",
        "01/01/2021",
      ),
    ).toBeNull();

    expect(
      Validations.dateNotBefore("2021-01-15", "anotherKey")(
        "key",
        "2021-01-16",
      ),
    ).toBeNull();
    expect(
      Validations.dateNotBefore("2021-01-15", "anotherKey")(
        "key",
        "2021-01-15",
      ),
    ).toBeNull();
    expect(
      Validations.dateNotBefore("2021-01-15", "anotherKey")(
        "key",
        "2021-01-14",
      ),
    ).toBeDefined();
    expect(
      Validations.dateNotBefore("2021-01-15")("key", "2020-01-15"),
    ).toBeDefined();
  });
});

describe("validate", () => {
  it("should execute all validations", async () => {
    const validations = {
      field1: [Validations.required, Validations.pattern(/^[\d]{4}$/)],
      field2: [Validations.required, Validations.date],
      field3: Validations.dateNotBefore("2021-01-01"),
      field4: null,
    };

    const testInputOK = {
      field1: "1111",
      field2: "2021-01-01",
      field3: null,
    };

    const testInputKO = {
      field1: "abc",
      field2: "01/01/2021",
      field3: "2020-12-31",
    };

    expect(() => {
      validate(testInputOK, validations);
    }).not.toThrow();

    expect(() => {
      validate(testInputKO, validations);
    }).toThrow(AppError);

    expect(() => {
      validate(undefined, validations);
    }).toThrow(AppError);
  });
});

describe("validateDateRange", () => {
  it("should execute all validations", async () => {
    expect(() => {
      validateDateRange(undefined);
    }).toThrow(AppError);

    expect(() => {
      validateDateRange({
        initDate: "20210101",
        endDate: "20210131",
      });
    }).toThrow(AppError);

    expect(() => {
      validateDateRange({
        initDate: "2021-02-01",
        endDate: "2021-01-31",
      });
    }).toThrow(AppError);

    expect(() => {
      validateDateRange({
        initDate: "2021-01-01",
        endDate: "2021-01-31",
      });
    }).not.toThrow();
  });
});
