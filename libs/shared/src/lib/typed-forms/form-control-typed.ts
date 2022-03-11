import { FormControl, ValidationErrors } from "@angular/forms";

import {
  BoxedValue,
  ControlEventOptions,
  ControlOptions,
  Modify,
} from "./types";
import { AbstractControlTyped } from "./abstract-control-typed";

export interface FormControlTyped<T, E extends ValidationErrors>
  extends Modify<FormControl, AbstractControlTyped<T, E>> {
  setValue(value: T, options?: ControlOptions): void;
  patchValue(value: T, options?: ControlOptions): void;

  reset(formState?: T | BoxedValue<T>, options?: ControlEventOptions): void;
}
