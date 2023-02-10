import {
  Component,
  EventEmitter,
  Inject,
  Input,
  LOCALE_ID,
  Output,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { AuthService } from "@detalluz/services";
import { RouterLinkTyped } from "@detalluz/shared";
import { LoginDialogComponent } from "../login/login-dialog.component";

export interface Language {
  code: string;
  label: string;
}

@Component({
  selector: "dtl-toolbar",
  templateUrl: "./toolbar.component.html",
  styleUrls: ["./toolbar.component.scss"],
})
export class ToolbarComponent {
  @Input() hideMenu? = false;
  @Input() hideLanguageSelection? = false;

  @Input() menuOpened = false;
  @Output() menuOpenedChange = new EventEmitter<boolean>();

  @Input() title!: string;

  @Input() languages?: Language[];

  @Input() hideUserActions? = false;

  @Input() loginLink: RouterLinkTyped = null;

  constructor(
    @Inject(LOCALE_ID) public locale: string,
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService,
  ) {}

  toggleMenu(): void {
    this.menuOpened = !this.menuOpened;
    this.menuOpenedChange.emit(this.menuOpened);
  }

  getLanguageUrl(language: string): string {
    return `/${language}${this.router.url}`;
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  login(): void {
    if (this.loginLink) {
      this.router.navigate(
        typeof this.loginLink === "string" ? [this.loginLink] : this.loginLink,
      );
    } else {
      this.dialog.open(LoginDialogComponent, {
        autoFocus: "dialog",
      });
    }
  }

  logout(): void {
    setTimeout(() => {
      this.authService.removeToken();
    }, 200);
  }
}
