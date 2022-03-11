import { FormArray, ValidationErrors } from "@angular/forms";
import { AbstractControlTyped } from "./abstract-control-typed";

import { ControlEventOptions, Modify } from "./types";

export interface FormArrayTyped<
  T,
  E extends ValidationErrors = ValidationErrors,
> extends Modify<FormArray, AbstractControlTyped<T, E>> {
  controls: AbstractControlTyped<T>[];

  at(index: number): AbstractControlTyped<T>;

  push(control: AbstractControlTyped<T>): void;

  insert(index: number, control: AbstractControlTyped<T>): void;

  setControl(index: number, control: AbstractControlTyped<T>): void;

  setValue(value: T[], options?: ControlEventOptions): void;

  patchValue(value: T[], options?: ControlEventOptions): void;

  reset(value?: T[], options?: ControlEventOptions): void;

  getRawValue(): T[];
}
