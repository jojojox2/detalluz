import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { RouterLinkTyped } from "@detalluz/shared";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { filter } from "rxjs";
import { SidenavItem } from "../sidenav/sidenav.component";
import { Language } from "../toolbar/toolbar.component";

@UntilDestroy()
@Component({
  selector: "dtl-navigable-app",
  templateUrl: "./navigable-app.component.html",
  styleUrls: ["./navigable-app.component.scss"],
})
export class NavigableAppComponent {
  @Input() title!: string;

  @Input() menuItems: SidenavItem[] = [];

  @Input() hiddenToolbarUrls: string[] = [];

  @Input() sidenavOpened = false;
  @Output() sidenavOpenedChange = new EventEmitter<boolean>();

  @Input() languages?: Language[];

  @Input() loginLink: RouterLinkTyped = null;

  mobile = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
  ) {
    this.breakpointObserver
      .observe([Breakpoints.XSmall])
      .pipe(untilDestroyed(this))
      .subscribe((result) => {
        this.mobile = result.matches;
      });
    this.router.events
      .pipe(
        untilDestroyed(this),
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      )
      .subscribe(() => {
        if (this.mobile) {
          this.sidenavOpened = false;
        }
      });
  }

  showMenus(): boolean {
    return !this.hiddenToolbarUrls.includes(this.router.url);
  }
}
