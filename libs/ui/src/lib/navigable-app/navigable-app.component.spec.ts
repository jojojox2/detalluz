import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";

import { NavigableAppComponent } from "./navigable-app.component";

describe("NavigableAppComponent", () => {
  let component: NavigableAppComponent;
  let fixture: ComponentFixture<NavigableAppComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavigableAppComponent],
      imports: [RouterTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigableAppComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    jest.spyOn(router, "url", "get").mockReturnValue("/test");
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("showMenus", () => {
    it("should hide menus for restricted urls", () => {
      component.hiddenToolbarUrls = ["/test"];
      expect(component.showMenus()).toBeFalsy();
    });

    it("should show menus for non-restricted urls", () => {
      component.hiddenToolbarUrls = ["/another-test"];
      expect(component.showMenus()).toBeTruthy();
    });
  });
});
