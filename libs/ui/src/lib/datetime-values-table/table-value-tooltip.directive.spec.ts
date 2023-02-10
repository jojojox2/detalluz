import { OverlayContainer } from "@angular/cdk/overlay";
import { CommonModule } from "@angular/common";
import { Component, DebugElement } from "@angular/core";
import {
  ComponentFixture,
  TestBed,
  inject,
  tick,
  fakeAsync,
} from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { MaterialModule } from "@detalluz/material";
import {
  ExtendedMatTooltipDirective,
  TableValueTooltipDirective,
} from "./table-value-tooltip.directive";

@Component({
  template: `<span
  [dtlTableValueTooltip]="tooltipValue"
  dtlTableValueTooltipDelay="200"
  [dtlTableValueTooltipUnit]="unit"
  [dtlTableValueTooltipFormat]="format"
></span>
`,
})
class TestComponent {
  tooltipValue: number | null | undefined = 123.45;
  unit: string | null | undefined = "kWh";
  format: string | undefined;
}

describe("TableValueTooltipDirective", () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let spanDebugElement: DebugElement;
  let matTooltipDirective: ExtendedMatTooltipDirective;
  let overlayContainerElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        TableValueTooltipDirective,
        ExtendedMatTooltipDirective,
        TestComponent,
      ],
      imports: [CommonModule, MaterialModule],
    }).compileComponents();
    inject([OverlayContainer], (oc: OverlayContainer): void => {
      overlayContainerElement = oc.getContainerElement();
    })();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    spanDebugElement = fixture.debugElement.query(By.css("span"));
    matTooltipDirective =
      spanDebugElement.injector.get<ExtendedMatTooltipDirective>(
        ExtendedMatTooltipDirective,
      );
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should display a formatted tooltip", fakeAsync(() => {
    matTooltipDirective.show();
    fixture.detectChanges();
    tick(500);

    const tooltipElement = overlayContainerElement.querySelector(
      ".mat-mdc-tooltip",
    ) as HTMLElement;
    expect(tooltipElement instanceof HTMLElement).toBe(true);
    expect(overlayContainerElement.textContent).toContain("123.45 kWh");
  }));

  it("should display a custom formatted tooltip", fakeAsync(() => {
    component.format = "1.5-5";
    matTooltipDirective.show();
    fixture.detectChanges();
    tick(500);

    const tooltipElement = overlayContainerElement.querySelector(
      ".mat-mdc-tooltip",
    ) as HTMLElement;
    expect(tooltipElement instanceof HTMLElement).toBe(true);
    expect(overlayContainerElement.textContent).toContain("123.45000 kWh");
  }));

  it("should not display a tooltip with a null value", fakeAsync(() => {
    component.tooltipValue = null;

    matTooltipDirective.show();
    fixture.detectChanges();
    tick(500);

    const tooltipElement = overlayContainerElement.querySelector(
      ".mat-mdc-tooltip",
    ) as HTMLElement;
    expect(tooltipElement instanceof HTMLElement).toBe(true);
    expect(overlayContainerElement.textContent).toBe("");
  }));

  it("should be able to show a tooltip without unit", fakeAsync(() => {
    component.unit = null;

    matTooltipDirective.show();
    fixture.detectChanges();
    tick(500);

    const tooltipElement = overlayContainerElement.querySelector(
      ".mat-mdc-tooltip",
    ) as HTMLElement;
    expect(tooltipElement instanceof HTMLElement).toBe(true);
    expect(overlayContainerElement.textContent).toContain("123.45");
  }));
});
