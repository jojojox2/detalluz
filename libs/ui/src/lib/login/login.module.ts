import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaterialModule } from "@detalluz/material";
import { LoginComponent } from "./login.component";
import { ReactiveFormsModule } from "@angular/forms";
import { LoginDialogComponent } from "./login-dialog.component";

export { LoginForm } from "./login.component";
export { LoginDialogComponent } from "./login-dialog.component";

@NgModule({
  declarations: [LoginComponent, LoginDialogComponent],
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  exports: [LoginComponent, LoginDialogComponent],
})
export class LoginModule {}
