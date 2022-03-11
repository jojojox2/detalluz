import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from "@angular/core/testing";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { MaterialModule } from "@detalluz/material";
import { firstValueFrom, of } from "rxjs";

import { DialogEntryComponent } from "./dialog-entry.component";

describe("DialogEntryComponent", () => {
  let component: DialogEntryComponent;
  let fixture: ComponentFixture<DialogEntryComponent>;
  let router: Router;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogEntryComponent],
      imports: [RouterTestingModule, MaterialModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEntryComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    dialog = TestBed.inject(MatDialog);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should open a new dialog", fakeAsync(() => {
    const spyOpen = jest.spyOn(dialog, "open");
    const spyNavigate = jest
      .spyOn(router, "navigate")
      .mockReturnValue(firstValueFrom(of(true)));

    component.openDialog();
    fixture.detectChanges();

    expect(spyOpen).toHaveBeenCalled();

    const dialogRef = spyOpen.mock.results[0].value;
    expect(dialogRef).toBeDefined();

    dialogRef.close();
    fixture.detectChanges();
    tick(500);

    expect(spyNavigate).toHaveBeenCalled();
  }));
});
