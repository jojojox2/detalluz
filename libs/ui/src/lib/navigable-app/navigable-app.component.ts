import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Router } from "@angular/router";
import { RouterLinkTyped } from "@detalluz/shared";
import { SidenavItem } from "../sidenav/sidenav.component";
import { Language } from "../toolbar/toolbar.component";

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

  constructor(private router: Router) {}

  showMenus(): boolean {
    return !this.hiddenToolbarUrls.includes(this.router.url);
  }
}
