import { CommonModule } from "@angular/common";
import { TestBed } from "@angular/core/testing";
import { MatDialog } from "@angular/material/dialog";
import { MaterialModule } from "@detalluz/material";
import { delay, of } from "rxjs";

import { NoticeService } from "./notice.service";

describe("NoticeService", () => {
  let service: NoticeService;
  let matDialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, MaterialModule],
      providers: [MatDialog],
    });
    service = TestBed.inject(NoticeService);
    matDialog = TestBed.inject(MatDialog);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should open a new notice", () => {
    service.showMessage("example");

    expect(matDialog.openDialogs.length).toBe(1);
  });

  it("should handle multiple notices", () => {
    const openMock = jest.fn().mockReturnValue({
      afterOpened: () => of({}),
      afterClosed: () => of({}).pipe(delay(2000)),
      componentInstance: {
        getCurrentPosition: jest.fn().mockReturnValue(0),
      },
    });
    matDialog.open = openMock;

    service.showMessage("example 1");
    service.showMessage("example 2");

    expect(matDialog.open).toHaveBeenCalledTimes(2);
  });

  it("should show a success notice", () => {
    service.showSuccessMessage("example");

    expect(matDialog.openDialogs.length).toBe(1);
  });

  it("should show a warning notice", () => {
    service.showWarningMessage("example");

    expect(matDialog.openDialogs.length).toBe(1);
  });

  it("should show an error notice", () => {
    service.showErrorMessage("example");

    expect(matDialog.openDialogs.length).toBe(1);
  });
});
