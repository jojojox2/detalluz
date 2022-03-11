import { Component, OnInit, Inject, ElementRef } from "@angular/core";
import { Notice } from "./notice.model";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "dtl-notice",
  templateUrl: "./notice.component.html",
  styleUrls: ["./notice.component.sass"],
})
export class NoticeComponent implements OnInit {
  public message = "";
  public progress = 0;
  public holdProgress = false;

  constructor(
    private dialogRef: MatDialogRef<NoticeComponent>,
    private element: ElementRef,
    @Inject(MAT_DIALOG_DATA) private data: Notice,
  ) {}

  ngOnInit(): void {
    this.message = this.data.message;
    this.progress = 100;
  }

  public getCurrentPosition(): number {
    return (
      this.element.nativeElement?.parentElement?.parentElement?.offsetTop ?? 0
    );
  }

  public close(): void {
    this.dialogRef.close();
  }
}
