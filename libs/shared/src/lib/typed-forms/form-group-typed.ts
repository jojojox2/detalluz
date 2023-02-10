import { FormGroup, ValidationErrors } from "@angular/forms";
import { ControlEventOptions, ExtractStrings, Modify } from "./types";
import { AbstractControlTyped } from "./abstract-control-typed";

export interface FormGroupTyped<
  T,
  E extends ValidationErrors = ValidationErrors,
> extends Modify<FormGroup, AbstractControlTyped<T, E>> {
  controls: { [K1 in keyof T]: AbstractControlTyped<T[K1]> };

  registerControl<K1 extends ExtractStrings<T>, E extends ValidationErrors>(
    name: K1,
    control: AbstractControlTyped<T[K1], E>,
  ): AbstractControlTyped<T[K1], E>;

  addControl<K1 extends ExtractStrings<T>, E extends ValidationErrors>(
    name: K1,
    control: AbstractControlTyped<T[K1], E>,
  ): void;

  removeControl<K1 extends ExtractStrings<T>>(
    name: K1,
    options?: {
      emitEvent?: boolean;
    },
  ): void;

  setControl<K1 extends ExtractStrings<T>, E extends ValidationErrors>(
    name: K1,
    control: AbstractControlTyped<T[K1], E>,
    options?: {
      emitEvent?: boolean;
    },
  ): void;

  contains(controlName: ExtractStrings<T>): boolean;

  setValue(value: T, options?: ControlEventOptions): void;
  patchValue(value: Partial<T>, options?: ControlEventOptions): void;
  reset(formState?: Partial<T>, options?: ControlEventOptions): void;

  getRawValue(): T;
}
