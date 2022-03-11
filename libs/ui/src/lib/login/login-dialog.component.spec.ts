import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialogRef } from "@angular/material/dialog";
import { MaterialModule } from "@detalluz/material";
import { LoginDialogComponent } from "./login-dialog.component";

describe("LoginDialogComponent", () => {
  let component: LoginDialogComponent;
  let fixture: ComponentFixture<LoginDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginDialogComponent],
      imports: [MaterialModule],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: jest.fn(),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should close dialog on login event", () => {
    const spyClose = jest.spyOn(component.dialogRef, "close");

    component.login();

    expect(spyClose).toHaveBeenCalled();
  });

  it("should close dialog with cancel button", () => {
    const spyClose = jest.spyOn(component.dialogRef, "close");

    component.cancel();

    expect(spyClose).toHaveBeenCalled();
  });
});
