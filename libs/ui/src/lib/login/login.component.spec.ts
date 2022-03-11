import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { Token } from "@detalluz/api";
import { MaterialModule } from "@detalluz/material";
import { AuthService } from "@detalluz/services";
import { of, throwError } from "rxjs";
import { LoginComponent } from "./login.component";

describe("LoginComponent", () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: Partial<AuthService>;

  beforeEach(async () => {
    mockAuthService = {
      createToken: jest.fn().mockReturnValue(
        of<Token>({
          token: "abc",
        }),
      ),
      isAuthenticated: jest.fn().mockReturnValue(true),
    };

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule, MaterialModule],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should emit cancel event", (done) => {
    component.cancel.subscribe(() => {
      done();
    });

    component.onCancel();
  });

  it("should emit login event on successful login execution", (done) => {
    component.login.subscribe(() => {
      done();
    });

    component.loginForm.setValue({
      email: "test@example.com",
      password: "password",
      rememberMe: false,
    });

    component.onLogin();
  });

  it("should not emit login event on failed login", () => {
    mockAuthService.createToken = jest
      .fn()
      .mockReturnValue(throwError(() => "mocked error"));

    component.loginForm.setValue({
      email: "test@example.com",
      password: "password",
      rememberMe: false,
    });

    component.onLogin();
    fixture.detectChanges();

    expect(component.invalidCredentials).toBe(true);
  });
});
