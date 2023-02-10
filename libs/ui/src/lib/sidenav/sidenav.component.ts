import { Component, Input } from "@angular/core";
import { RouterLinkTyped } from "@detalluz/shared";

export interface SidenavItem {
  link: RouterLinkTyped;
  text: string;
}

@Component({
  selector: "dtl-sidenav",
  templateUrl: "./sidenav.component.html",
  styleUrls: ["./sidenav.component.scss"],
})
export class SidenavComponent {
  @Input() items: SidenavItem[] = [];
}
