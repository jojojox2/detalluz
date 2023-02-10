import { Component } from "@angular/core";
import { LocalizeFn } from "@angular/localize/init";
import { RouterLinkTyped } from "@detalluz/shared";
import { Language, SidenavItem } from "@detalluz/ui";

declare const $localize: LocalizeFn;

@Component({
  selector: "detalluz-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = $localize`:@@detalluz-app.title:Detalluz`;

  menuItems: SidenavItem[] = [
    {
      link: "/",
      text: $localize`:@@detalluz-app.menu.homepage:Homepage`,
    },
    {
      link: "/invoice-simulator",
      text: $localize`:@@detalluz-app.menu.invoice-simulator:Invoice simulator`,
    },
    {
      link: "/info",
      text: $localize`:@@detalluz-app.menu.info:Info`,
    },
  ];

  languages: Language[] = [
    {
      code: "en",
      label: $localize`:@@language.english:English`,
    },
    {
      code: "es",
      label: $localize`:@@language.spanish:Español`,
    },
  ];

  loginLink: RouterLinkTyped = [{ outlets: { dialog: ["login"] } }];
}
