import { FormGroup, ValidationErrors } from "@angular/forms";
import { ControlEventOptions, ExtractStrings, Modify } from "./types";
import { AbstractControlTyped } from "./abstract-control-typed";

export interface FormGroupTyped<
  T,
  E extends ValidationErrors = ValidationErrors,
> extends Modify<FormGroup, AbstractControlTyped<T, E>> {
  controls: { [K1 in keyof T]: AbstractControlTyped<T[K1]> };

  registerControl<K1 extends ExtractStrings<T>, R>(
    name: K1,
    control: AbstractControlTyped<T[K1], R>,
  ): AbstractControlTyped<T[K1], R>;

  addControl<K1 extends ExtractStrings<T>, R>(
    name: K1,
    control: AbstractControlTyped<T[K1], R>,
  ): void;

  removeControl<K1 extends ExtractStrings<T>>(
    name: K1,
    options?: {
      emitEvent?: boolean;
    },
  ): void;

  setControl<K1 extends ExtractStrings<T>, R>(
    name: K1,
    control: AbstractControlTyped<T[K1], R>,
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
