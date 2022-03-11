import { Component, Input } from "@angular/core";
import { LocalizeFn } from "@angular/localize/init";
import { MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldAppearance } from "@angular/material/form-field";

declare const $localize: LocalizeFn;

export interface LoginForm {
  email?: string;
  password?: string;
}

@Component({
  selector: "dtl-login-dialog",
  templateUrl: "./login-dialog.component.html",
  styleUrls: ["./login-dialog.component.sass"],
})
export class LoginDialogComponent {
  @Input()
  title: string = $localize`:@@login.dialog.title:Login`;
  @Input() fieldAppearance: MatFormFieldAppearance = "outline";

  constructor(public dialogRef: MatDialogRef<LoginDialogComponent>) {}

  login(): void {
    this.dialogRef.close();
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
