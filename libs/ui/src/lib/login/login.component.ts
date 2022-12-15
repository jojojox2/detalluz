import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { MatFormFieldAppearance } from "@angular/material/form-field";
import { AuthService } from "@detalluz/services";
import { FormGroupTyped } from "@detalluz/shared";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";

export interface LoginForm {
  target?: string;
  username?: string;
  password?: string;
  rememberMe?: boolean;
}

@UntilDestroy()
@Component({
  selector: "dtl-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.sass"],
})
export class LoginComponent implements OnInit {
  @Output() login = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  @Input() fieldAppearance: MatFormFieldAppearance = "outline";

  loginForm: FormGroupTyped<LoginForm> = this.fb.group({
    target: ["ide", Validators.required],
    username: [null, [Validators.required]],
    password: [null, Validators.required],
    rememberMe: [false],
  }) as FormGroupTyped<LoginForm>;

  invalidCredentials = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit(): void {
    this.loginForm.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(() => (this.invalidCredentials = false));
  }

  onLogin(): void {
    if (this.loginForm.invalid || this.invalidCredentials) {
      return;
    }

    this.authService
      .createToken(
        <string>this.loginForm.controls.target?.value,
        <string>this.loginForm.controls.username?.value,
        <string>this.loginForm.controls.password?.value,
        this.loginForm.controls.rememberMe?.value,
      )
      .subscribe({
        next: () => {
          this.login.next();
        },
        error: () => {
          this.invalidCredentials = true;
        },
      });
  }

  onCancel(): void {
    this.cancel.next();
  }
}
