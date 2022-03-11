import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { LoginDialogComponent } from "../login/login-dialog.component";

@Component({
  selector: "dtl-dialog-entry",
  template: "",
})
export class DialogEntryComponent {
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.openDialog();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(LoginDialogComponent);
    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(["../"], { relativeTo: this.route });
    });
  }
}
