import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Validators, FormBuilder } from "@angular/forms";
import { MatFormFieldAppearance } from "@angular/material/form-field";
import { FormGroupTyped } from "@detalluz/shared";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { distinctUntilChanged, tap, debounceTime } from "rxjs";

export interface InvoiceConfiguration {
  peakHiredPower?: number;
  valleyHiredPower?: number;
}

@UntilDestroy()
@Component({
  selector: "dtl-invoice-configuration",
  templateUrl: "./invoice-configuration.component.html",
  styleUrls: ["./invoice-configuration.component.sass"],
})
export class InvoiceConfigurationComponent implements OnInit {
  @Input() set data(value: InvoiceConfiguration) {
    if (value) {
      this.form.setValue(value);
    }
  }
  @Output() dataChange = new EventEmitter<InvoiceConfiguration>();

  @Input() fieldAppearance: MatFormFieldAppearance = "outline";

  @Input() set disabled(value: boolean) {
    this.disabledForm = value;
    this.updateEnablement();
  }
  private disabledForm = false;

  form: FormGroupTyped<InvoiceConfiguration> = this.fb.group({
    peakHiredPower: [null, Validators.required],
    valleyHiredPower: [null, Validators.required],
  }) as FormGroupTyped<InvoiceConfiguration>;

  linkPowerValues = true;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form.controls.peakHiredPower?.valueChanges
      .pipe(
        untilDestroyed(this),
        distinctUntilChanged(),
        tap((value) => {
          if (this.linkPowerValues) {
            this.form.controls.valleyHiredPower?.setValue(value);
          }
        }),
      )
      .subscribe();
    this.form.valueChanges
      .pipe(
        untilDestroyed(this),
        distinctUntilChanged((previous, current) => {
          return (
            previous?.peakHiredPower === current?.peakHiredPower &&
            previous?.valleyHiredPower === current?.valleyHiredPower
          );
        }),
        tap(() => {
          if (this.form.valid) {
            this.dataChange.next(this.form.getRawValue());
          }
        }),
        debounceTime(150),
      )
      .subscribe();

    this.updateEnablement();
  }

  toggleLinkPowerValues(): void {
    this.linkPowerValues = !this.linkPowerValues;
    if (this.linkPowerValues) {
      this.form.controls.valleyHiredPower?.setValue(
        this.form.controls.peakHiredPower?.value,
      );
    }
    this.updateEnablement();
  }

  private updateEnablement(): void {
    if (this.disabledForm) {
      this.form.controls.peakHiredPower?.disable();
      this.form.controls.valleyHiredPower?.disable();
    } else {
      this.form.controls.peakHiredPower?.enable();
      if (this.linkPowerValues) {
        this.form.controls.valleyHiredPower?.disable();
      } else {
        this.form.controls.valleyHiredPower?.enable();
      }
    }
  }
}
