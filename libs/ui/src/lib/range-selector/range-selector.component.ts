import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { MatFormFieldAppearance } from "@angular/material/form-field";
import { FormGroupTyped } from "@detalluz/shared";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { Dayjs } from "dayjs";
import { debounceTime, distinctUntilChanged, tap } from "rxjs";

export interface RangeSelectorForm {
  initDate?: Dayjs | null;
  endDate?: Dayjs | null;
}

@UntilDestroy()
@Component({
  selector: "dtl-range-selector",
  templateUrl: "./range-selector.component.html",
  styleUrls: ["./range-selector.component.scss"],
})
export class RangeSelectorComponent implements OnInit {
  @Input() set range(value: RangeSelectorForm) {
    if (
      value?.initDate !== this.rangeForm.value?.initDate ||
      value?.endDate !== this.rangeForm.value?.endDate
    ) {
      this.rangeForm.setValue(value);
    }
  }
  @Output() rangeChange = new EventEmitter<RangeSelectorForm>();

  @Output() search = new EventEmitter<RangeSelectorForm>();

  @Input() fieldAppearance: MatFormFieldAppearance = "outline";

  @Input() autoSearch? = false;

  @Input() disabled? = false;

  rangeForm: FormGroupTyped<RangeSelectorForm> = this.fb.group({
    initDate: [null, Validators.required],
    endDate: [null, Validators.required],
  }) as FormGroupTyped<RangeSelectorForm>;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.rangeForm.valueChanges
      .pipe(
        untilDestroyed(this),
        distinctUntilChanged((previous, current) => {
          return (
            previous?.initDate === current?.initDate &&
            previous?.endDate === current?.endDate
          );
        }),
        tap((range) => {
          this.rangeChange.next(range);
        }),
        debounceTime(150),
      )
      .subscribe(() => {
        if (this.autoSearch && this.rangeForm.valid) {
          this.doSearch();
        }
      });
  }

  doSearch(): void {
    if (this.rangeForm.invalid) {
      return;
    }

    this.search.emit(this.rangeForm.value);
  }
}
