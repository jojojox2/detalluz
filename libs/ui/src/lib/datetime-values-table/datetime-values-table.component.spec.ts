import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DEFAULT_TIMEZONE } from "@detalluz/shared";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

import { DatetimeValuesTableComponent } from "./datetime-values-table.component";

dayjs.extend(utc);
dayjs.extend(timezone);

describe("DatetimeValuesTableComponent", () => {
  let component: DatetimeValuesTableComponent;
  let fixture: ComponentFixture<DatetimeValuesTableComponent>;

  /**
   * Creates example values for testing purposes
   * @param startDate Initial date, with format YYYY-MM-DD
   * @param days Number of days to fill
   * @returns Array with values
   */
  function createExampleValues(
    startDate: string,
    days: number,
    timezone?: string,
  ) {
    const values = [];

    const initialDate = timezone
      ? dayjs.tz(`${startDate}T00:00:00`, "YYYY-MM-DDTHH:mm:SS", timezone)
      : dayjs(`${startDate}T00:00:00`, "YYYY-MM-DDTHH:mm:SS");
    let tmpDate = initialDate.clone();
    while (tmpDate.diff(initialDate, "day") < days) {
      values.push({
        date: tmpDate.format("YYYY-MM-DDTHH:mm:ss.mmmZ"),
        value: Math.random(),
      });
      tmpDate = tmpDate.add(1, "hour");
    }

    return values;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatetimeValuesTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatetimeValuesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should display a table with no total row/column", () => {
    component.values = createExampleValues("2020-01-01", 2);
    component.ngOnChanges();
    fixture.detectChanges();

    expect(component.displayedColumns).toBeDefined();
    expect(component.displayedColumns.length).toBe(1 + 24);

    expect(component.dataSource).toBeDefined();
    expect(component.dataSource.length).toBe(2);
  });

  it("should display a table with sum totals", () => {
    component.values = createExampleValues("2020-01-01", 2);
    component.totalDisplay = "sum";
    component.ngOnChanges();
    fixture.detectChanges();

    expect(component.displayedColumns).toBeDefined();
    expect(component.displayedColumns.length).toBe(1 + 24 + 1);
    expect(
      component.displayedColumns[component.displayedColumns.length - 1],
    ).toBe("sum");

    expect(component.dataSource).toBeDefined();
    expect(component.dataSource.length).toBe(2);
  });

  it("should display a table with mean totals", () => {
    component.values = createExampleValues("2020-01-01", 2);
    component.totalDisplay = "mean";
    component.ngOnChanges();
    fixture.detectChanges();

    expect(component.displayedColumns).toBeDefined();
    expect(component.displayedColumns.length).toBe(1 + 24 + 1);
    expect(
      component.displayedColumns[component.displayedColumns.length - 1],
    ).toBe("mean");

    expect(component.dataSource).toBeDefined();
    expect(component.dataSource.length).toBe(2);
  });

  it("should handle multiple values in same hour for summer time changes", () => {
    component.values = createExampleValues("2020-10-24", 3, DEFAULT_TIMEZONE);
    component.ngOnChanges();
    fixture.detectChanges();

    expect(component.dataSource).toBeDefined();
    expect(component.dataSource.length).toBe(3);
  });

  it("should skip empty values for a certain date/hour if not present or invalid", () => {
    component.values = createExampleValues("2020-01-01", 2);
    component.values.splice(2, 1);
    component.values[6].date = "wrong date";
    component.ngOnChanges();
    fixture.detectChanges();

    expect(component.dataSource).toBeDefined();
    expect(component.dataSource.length).toBe(2);
    expect(component.dataSource[0].count).toBe(22);
    expect(component.dataSource[0].values.length).toBe(24);
  });

  describe("hsl", () => {
    it("should get the hsl color configuration for a certain value", () => {
      component.values = createExampleValues("2020-01-01", 2);
      component.ngOnChanges();
      fixture.detectChanges();

      const hsl = component.getHsl(component.values[0].value);

      expect(hsl).toBeDefined();
    });

    it("should skip hsl configuration for null values", () => {
      component.values = createExampleValues("2020-01-01", 2);
      component.ngOnChanges();
      fixture.detectChanges();

      const hsl = component.getHsl(null);

      expect(hsl).toBe("");
    });

    it("should get the hsl color configuration when inverting color palette", () => {
      component.invertColors = true;
      component.values = createExampleValues("2020-01-01", 2);
      component.ngOnChanges();
      fixture.detectChanges();

      const hsl = component.getHsl(component.values[0].value);

      expect(hsl).toBeDefined();
    });
  });
});
