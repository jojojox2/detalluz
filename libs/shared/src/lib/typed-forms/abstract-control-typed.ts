import { AbstractControl, ValidationErrors } from "@angular/forms";
import { Observable } from "rxjs";
import {
  AsyncValidatorTypedFn,
  EmitEvent,
  ExtractStrings,
  ValidatorTypedFn,
} from "./types";

export interface AbstractControlTyped<
  T,
  E extends ValidationErrors = ValidationErrors,
> extends AbstractControl {
  readonly value: T;

  get validator(): ValidatorTypedFn<T, E> | null;
  set validator(validatorFn: ValidatorTypedFn<T, E> | null);

  get asyncValidator(): AsyncValidatorTypedFn<T, E> | null;
  set asyncValidator(asyncValidatorFn: AsyncValidatorTypedFn<T, E> | null);

  readonly errors: E | null;
  readonly valueChanges: Observable<T>;

  setValidators(
    validators: ValidatorTypedFn<T, E> | ValidatorTypedFn<T, E>[] | null,
  ): void;

  setAsyncValidators(
    validators:
      | AsyncValidatorTypedFn<T, E>
      | AsyncValidatorTypedFn<T, E>[]
      | null,
  ): void;

  addValidators(
    validators: ValidatorTypedFn<T, E> | ValidatorTypedFn<T, E>[],
  ): void;

  addAsyncValidators(
    validators: AsyncValidatorTypedFn<T, E> | AsyncValidatorTypedFn<T, E>[],
  ): void;

  removeValidators(
    validators: ValidatorTypedFn<T, E> | ValidatorTypedFn<T, E>[],
  ): void;

  removeAsyncValidators(
    validators: AsyncValidatorTypedFn<T, E> | AsyncValidatorTypedFn<T, E>[],
  ): void;

  hasValidator(validator: ValidatorTypedFn<T, E>): boolean;

  hasAsyncValidator(validator: AsyncValidatorTypedFn<T, E>): boolean;

  setErrors(errors: Partial<E> | null, opts?: EmitEvent): void;

  get<K1 extends keyof T>(path: [K1] | K1): AbstractControlTyped<T[K1]>;
  get<K1 extends keyof T, K2 extends keyof T[K1]>(
    path: [K1, K2],
  ): AbstractControlTyped<T[K1][K2]>;
  get<K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2]>(
    path: [K1, K2, K3],
  ): AbstractControlTyped<T[K1][K2][K3]>;
  get<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
  >(
    path: [K1, K2, K3, K4],
  ): AbstractControlTyped<T[K1][K2][K3][K4]>;

  getError<
    K1 extends ExtractStrings<T>,
    K2 extends ExtractStrings<T[K1]>,
    K3 extends ExtractStrings<T[K1][K2]>,
    K4 extends ExtractStrings<T[K1][K2][K3]>,
    E1 extends ExtractStrings<E>,
  >(
    errorCode: E1,
    path?: K1 | [K1] | [K1, K2] | [K1, K2, K3] | [K1, K2, K3, K4],
  ): E[E1] | null;

  hasError<
    K1 extends ExtractStrings<T>,
    K2 extends ExtractStrings<T[K1]>,
    K3 extends ExtractStrings<T[K1][K2]>,
    K4 extends ExtractStrings<T[K1][K2][K3]>,
    E1 extends ExtractStrings<E>,
  >(
    errorCode: E1,
    path?: K1 | [K1] | [K1, K2] | [K1, K2, K3] | [K1, K2, K3, K4],
  ): boolean;
}
