import { Injectable } from "@angular/core";
import { NoticeComponent } from "./notice.component";
import { Notice, NoticeType } from "./notice.model";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { NoopScrollStrategy } from "@angular/cdk/overlay";

interface DialogStatus {
  dialogRef: MatDialogRef<NoticeComponent, void>;
  opened: boolean;
}

@Injectable({
  providedIn: "root",
})
export class NoticeService {
  private dialogList: DialogStatus[] = [];
  private pendingNotices: Notice[] = [];

  constructor(private dialog: MatDialog) {}

  public showMessage(text: string, type?: NoticeType): void {
    if (!type) {
      type = NoticeType.DEFAULT;
    }

    const data: Notice = {
      message: text,
      type: type,
    };

    const pendingDialog = this.dialogList.find(
      (dialog) => dialog.opened === false,
    );

    if (pendingDialog) {
      this.pendingNotices.push(data);
    } else {
      this.openDialog(data);
    }
  }

  public showErrorMessage(text: string): void {
    this.showMessage(text, NoticeType.ERROR);
  }

  public showWarningMessage(text: string): void {
    this.showMessage(text, NoticeType.WARNING);
  }

  public showSuccessMessage(text: string): void {
    this.showMessage(text, NoticeType.SUCCESS);
  }

  private openDialog(data: Notice): MatDialogRef<NoticeComponent, void> {
    const panelClass: string[] = ["notice-panel"];
    switch (data.type) {
      case NoticeType.ERROR:
        panelClass.push("error");
        break;
      case NoticeType.WARNING:
        panelClass.push("warning");
        break;
      case NoticeType.SUCCESS:
        panelClass.push("success");
        break;
      default:
    }

    let nextPosition = "0px";

    if (this.dialogList.length > 0) {
      const currentTopPosition =
        this.dialogList[
          this.dialogList.length - 1
        ].dialogRef.componentInstance.getCurrentPosition();
      const viewHeight = document.documentElement?.clientHeight;
      if (viewHeight) {
        nextPosition = viewHeight - currentTopPosition + "px";
      } else {
        nextPosition = "100vh - " + currentTopPosition + "px";
      }
    }

    const position = {
      bottom: "calc(" + nextPosition + " + 15px)",
    };

    const dialogRef = this.dialog.open(NoticeComponent, {
      data: data,
      hasBackdrop: false,
      panelClass: panelClass,
      scrollStrategy: new NoopScrollStrategy(),
      position: position,
      autoFocus: false,
      restoreFocus: false,
    });

    const dialogStatus: DialogStatus = { dialogRef: dialogRef, opened: false };
    this.dialogList.push(dialogStatus);

    dialogRef.afterOpened().subscribe(() => {
      const currentTopPosition =
        dialogRef.componentInstance.getCurrentPosition();
      if (currentTopPosition < 0) {
        dialogRef.updatePosition({
          bottom: "calc(15px)",
        });
      }
      dialogStatus.opened = true;
      this.openPendingDialogs();
    });

    dialogRef.afterClosed().subscribe(() => {
      const index = this.dialogList.indexOf(dialogStatus);
      if (index >= 0) {
        this.dialogList.splice(index, 1);
      }
    });

    return dialogRef;
  }

  private openPendingDialogs(): void {
    if (this.pendingNotices.length > 0) {
      const notice = this.pendingNotices.splice(0, 1)[0];
      this.openDialog(notice);
    }
  }
}
