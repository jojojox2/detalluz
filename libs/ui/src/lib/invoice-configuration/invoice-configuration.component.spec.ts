import { CommonModule } from "@angular/common";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "@detalluz/material";

import { InvoiceConfigurationComponent } from "./invoice-configuration.component";

describe("InvoiceConfigurationComponent", () => {
  let component: InvoiceConfigurationComponent;
  let fixture: ComponentFixture<InvoiceConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvoiceConfigurationComponent],
      imports: [CommonModule, ReactiveFormsModule, MaterialModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should toggle linked power status", () => {
    component.linkPowerValues = false;
    component.data = {
      peakHiredPower: 1,
      valleyHiredPower: 2,
    };

    component.toggleLinkPowerValues();

    expect(component.linkPowerValues).toBe(true);
    expect(component.form.getRawValue().valleyHiredPower).toBe(1);
  });

  it("should be able to disable all fields", () => {
    component.disabled = true;

    expect(component.form.controls.peakHiredPower?.disabled).toBe(true);
    expect(component.form.controls.valleyHiredPower?.disabled).toBe(true);
  });

  it("should enable valley power when unlinked", () => {
    component.linkPowerValues = true;
    component.disabled = false;

    component.toggleLinkPowerValues();

    expect(component.form.controls.peakHiredPower?.disabled).toBe(false);
    expect(component.form.controls.valleyHiredPower?.disabled).toBe(false);
  });

  it("should disable valley power when linked", () => {
    component.linkPowerValues = false;
    component.disabled = false;

    component.toggleLinkPowerValues();

    expect(component.form.controls.peakHiredPower?.disabled).toBe(false);
    expect(component.form.controls.valleyHiredPower?.disabled).toBe(true);
  });
});
