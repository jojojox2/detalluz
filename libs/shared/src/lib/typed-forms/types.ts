import {
  ValidationErrors,
  ValidatorFn,
  AsyncValidatorFn,
} from "@angular/forms";
import { Observable } from "rxjs";
import { AbstractControlTyped } from "./abstract-control-typed";

export type Modify<T, R> = Omit<T, keyof R> & R;

export type ExtractStrings<T> = Extract<keyof T, string>;

export type BoxedValue<T> = { value: T; disabled?: boolean };

export type ControlOptions = {
  onlySelf?: boolean;
  emitEvent?: boolean;
  emitModelToViewChange?: boolean;
  emitViewToModelChange?: boolean;
};
export type EmitEvent = Pick<ControlOptions, "emitEvent">;
export type ControlEventOptions = Pick<
  ControlOptions,
  "emitEvent" | "onlySelf"
>;

export interface ValidatorTypedFn<T, E extends ValidationErrors>
  extends ValidatorFn {
  (control: AbstractControlTyped<T, E>): ValidationTypedErrors<E> | null;
}

export interface AsyncValidatorTypedFn<T, E extends ValidationErrors>
  extends AsyncValidatorFn {
  (control: AbstractControlTyped<T, E>):
    | Promise<ValidationTypedErrors<E> | null>
    | Observable<ValidationTypedErrors<E> | null>;
}

export type ValidationTypedErrors<E extends ValidationErrors> = E;
