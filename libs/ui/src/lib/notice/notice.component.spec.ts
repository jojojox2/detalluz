import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

import { NoticeComponent } from "./notice.component";
import { Notice, NoticeType } from "./notice.model";

describe("NoticeComponent", () => {
  let component: NoticeComponent;
  let fixture: ComponentFixture<NoticeComponent>;
  const exampleNotice: Notice = {
    type: NoticeType.SUCCESS,
    message: "example",
  };
  const mockDialogRef = {
    close: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NoticeComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: mockDialogRef,
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: exampleNotice,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should get the current dialog position", () => {
    const position = component.getCurrentPosition();
    expect(position).toBeDefined();
  });

  it("should close the dialog", () => {
    component.close();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });
});
