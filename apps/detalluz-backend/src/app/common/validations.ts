import dayjs from "dayjs";
import { AppError } from "./error";

export class Validations {
  static required: ValidatorFn = (
    key: string,
    value?: unknown,
  ): ValidationError | null => {
    if (!value) {
      return {
        key: key,
        message: `${key} is required`,
        value: value,
      };
    }
    return null;
  };

  static pattern(pattern: string | RegExp): ValidatorFn {
    return (key: string, value?: unknown): ValidationError | null => {
      if (value && typeof value === "string") {
        const regex: RegExp =
          pattern instanceof RegExp ? pattern : new RegExp(pattern);

        if (!regex.test(value)) {
          return {
            key: key,
            message: `${key} has invalid format`,
            value: value,
          };
        }
      }
      return null;
    };
  }

  static date: ValidatorFn = (
    key: string,
    value?: unknown,
  ): ValidationError | null => {
    if (value && typeof value === "string") {
      const date = dayjs(value, "YYYY-MM-DD", true);
      if (!date.isValid()) {
        return {
          key: key,
          message: `${key} must be a valid date (YYYY-MM-DD)`,
          value: value,
        };
      }
    }
    return null;
  };

  static dateNotBefore(reference: unknown, referenceKey?: string): ValidatorFn {
    return (key: string, value?: unknown): ValidationError | null => {
      if (
        value &&
        reference &&
        typeof value === "string" &&
        typeof reference === "string"
      ) {
        const date = dayjs(value, "YYYY-MM-DD", true);
        const referenceDate = dayjs(reference, "YYYY-MM-DD", true);
        if (date.isValid() && referenceDate.isValid() && date < referenceDate) {
          return {
            key: key,
            message: `${key} cannot be older than ${referenceKey || reference}`,
            value: value,
          };
        }
      }
      return null;
    };
  }
}

export function validate<T>(
  input: Partial<Record<keyof T, unknown>> | undefined,
  validations: FieldsValidation,
): void {
  const validationResults: (ValidationError | null)[] = Object.entries(
    validations,
  )
    .flatMap(([param, validators]) => {
      const validatorsArray = makeValidatorsArray(validators);

      return validatorsArray.map((v) => v(param, input?.[<keyof T>param]));
    })
    .filter((v) => !!v?.message);

  if (validationResults.length > 0) {
    const errors = validationResults.map((v) => <string>v?.message);
    throw new AppError("Invalid parameters", 422, errors);
  }
}

export function validateDateRange<T>(
  input: Partial<Record<keyof T, unknown>> | undefined,
): void {
  validate(input, {
    initDate: [Validations.required, Validations.date],
    endDate: [
      Validations.required,
      Validations.date,
      Validations.dateNotBefore(
        <string>input?.[<keyof T>"initDate"],
        "initDate",
      ),
    ],
  });
}

interface ValidationError {
  key: string;
  message: string;
  value?: unknown;
}

interface ValidatorFn {
  (key: string, value: unknown): ValidationError | null;
}

interface FieldsValidation {
  [field: string]: ValidatorFn | (ValidatorFn | null)[] | null;
}

function makeValidatorsArray(
  validators: ValidatorFn | (ValidatorFn | null)[] | null,
): ValidatorFn[] {
  if (Array.isArray(validators)) {
    return <ValidatorFn[]>validators.filter((v) => v);
  } else if (validators) {
    return [validators];
  } else {
    return [];
  }
}
