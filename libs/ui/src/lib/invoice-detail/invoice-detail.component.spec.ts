import { CommonModule } from "@angular/common";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MaterialModule } from "@detalluz/material";
import dayjs from "dayjs";
import { RangeSelectorForm } from "../range-selector/range-selector.component";

import { InvoiceDetailComponent } from "./invoice-detail.component";
import { InvoiceConcept } from "./invoice-detail.model";

describe("InvoiceDetailComponent", () => {
  let component: InvoiceDetailComponent;
  let fixture: ComponentFixture<InvoiceDetailComponent>;

  const exampleRange: RangeSelectorForm = {
    initDate: dayjs("2020-01-01"),
    endDate: dayjs("2020-01-07"),
  };
  const exampleConcepts: InvoiceConcept[] = [
    {
      title: "Concept A",
      value: 3,
      subconcepts: [
        {
          title: "Subconcept A.1",
          value: 1,
        },
        {
          title: "Subconcept A.2",
          value: 2,
        },
      ],
    },
    {
      title: "Concept B",
      calculationDetail: "(insert formula here)",
      value: 10,
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvoiceDetailComponent],
      imports: [CommonModule, MaterialModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should display a list of concepts", () => {
    component.range = exampleRange;
    component.concepts = exampleConcepts;

    component.ngOnChanges();

    expect(component.invoiceDays).toBe(7);
    expect(component.dataSource.data).not.toBeNull();
    expect(component.dataSource.data).toHaveLength(2);
  });

  it("should handle null inputs", () => {
    component.range = null;
    component.concepts = null;
    component.ngOnChanges();
    expect(component.invoiceDays).toBe(0);
    expect(component.dataSource.data).toHaveLength(0);

    component.concepts = [];
    component.ngOnChanges();
    expect(component.dataSource.data).toHaveLength(0);

    component.concepts = exampleConcepts;
    component.ngOnChanges();
    expect(component.dataSource.data).toHaveLength(2);

    component.range = {};
    component.ngOnChanges();
    expect(component.invoiceDays).toBe(0);

    component.range = {
      initDate: exampleRange.initDate,
    };
    component.ngOnChanges();
    expect(component.invoiceDays).toBe(0);

    component.range = {
      endDate: exampleRange.endDate,
    };
    component.ngOnChanges();
    expect(component.invoiceDays).toBe(0);
  });

  it("should detect nodes with children", () => {
    const node: InvoiceConcept = {
      title: "node",
      subconcepts: [
        {
          title: "subconcept",
        },
      ],
    };
    const result = component.hasChild(0, node);

    expect(result).toBe(true);
  });

  it("should detect nodes with no children", () => {
    const node: InvoiceConcept = {
      title: "node",
    };
    let result = component.hasChild(0, node);
    expect(result).toBe(false);

    node.subconcepts = [];
    result = component.hasChild(0, node);
    expect(result).toBe(false);
  });
});
