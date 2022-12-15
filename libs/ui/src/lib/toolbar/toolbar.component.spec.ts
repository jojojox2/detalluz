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
import { AuthService } from "@detalluz/services";
import { firstValueFrom, of } from "rxjs";
import { LoginDialogComponent } from "../login/login-dialog.component";

import { ToolbarComponent } from "./toolbar.component";

describe("ToolbarComponent", () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;
  let router: Router;
  let dialog: MatDialog;
  let mockAuthService: Partial<AuthService>;

  beforeEach(async () => {
    mockAuthService = {
      isAuthenticated: jest.fn().mockReturnValue(true),
      removeToken: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [ToolbarComponent],
      imports: [RouterTestingModule, MaterialModule],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    dialog = TestBed.inject(MatDialog);
    jest.spyOn(router, "url", "get").mockReturnValue("/test");
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should be able to show and hide the menu", () => {
    const spyChange = jest.spyOn(component.menuOpenedChange, "emit");

    component.menuOpened = false;

    component.toggleMenu();
    expect(component.menuOpened).toBeTruthy();
    expect(spyChange).toHaveBeenCalledWith(true);

    component.toggleMenu();
    expect(component.menuOpened).toBeFalsy();
    expect(spyChange).toHaveBeenCalledWith(false);
  });

  it("should be able to change the language", () => {
    component.languages = [
      {
        code: "en",
        label: "English",
      },
      {
        code: "es",
        label: "Español",
      },
    ];
    component.hideLanguageSelection = false;

    const url = component.getLanguageUrl("en");

    expect(url).toBe("/en/test");
  });

  describe("User actions", () => {
    it("should navigate to login url if provided", () => {
      const spyNavigate = jest
        .spyOn(router, "navigate")
        .mockReturnValue(firstValueFrom(of(true)));
      component.loginLink = "/login";

      component.login();

      expect(spyNavigate).toHaveBeenCalledWith([component.loginLink]);
    });

    it("should navigate to login custom state if provided", () => {
      const spyNavigate = jest
        .spyOn(router, "navigate")
        .mockReturnValue(firstValueFrom(of(true)));
      component.loginLink = [{ outlets: { custom: "login" } }];

      component.login();

      expect(spyNavigate).toHaveBeenCalledWith(component.loginLink);
    });

    it("should open a new login dialog if no link is provided", () => {
      const spyOpen = jest.spyOn(dialog, "open");
      component.loginLink = null;

      component.login();
      fixture.detectChanges();

      expect(spyOpen).toHaveBeenCalledWith(LoginDialogComponent, {
        autoFocus: "dialog",
      });
    });

    it("should clear session on logout", fakeAsync(() => {
      component.logout();
      fixture.detectChanges();
      tick(300);

      expect(mockAuthService.removeToken).toHaveBeenCalled();
    }));
  });
});
