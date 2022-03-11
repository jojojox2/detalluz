import { ComponentFixture, TestBed } from "@angular/core/testing";
import dayjs from "dayjs";
import {
  RangeSelectorComponent,
  RangeSelectorForm,
} from "./range-selector.component";
import { RangeSelectorModule } from "./range-selector.module";

describe("RangeSelectorComponent", () => {
  let component: RangeSelectorComponent;
  let fixture: ComponentFixture<RangeSelectorComponent>;

  const exampleRange: RangeSelectorForm = {
    initDate: dayjs("2021-01-01"),
    endDate: dayjs("2021-01-02"),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RangeSelectorModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RangeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should update on input changes", () => {
    component.range = exampleRange;

    expect(component.rangeForm.value).toStrictEqual(exampleRange);
  });

  it("should clear form on empty input", () => {
    component.range = {
      initDate: null,
      endDate: null,
    };

    expect(component.rangeForm.value).toStrictEqual({
      initDate: null,
      endDate: null,
    });
  });

  it("should emit search event if range is valid", (done) => {
    component.rangeForm.setValue(exampleRange);
    fixture.detectChanges();

    component.search.subscribe((range) => {
      expect(range).toBeDefined();
      expect(range).toStrictEqual(exampleRange);
      done();
    });

    component.doSearch();
  });

  it("should not emit event if form is invalid", () => {
    component.rangeForm.setValue({
      initDate: null,
      endDate: null,
    });
    const subscription = jest.fn();
    component.search.subscribe(subscription);
    fixture.detectChanges();

    component.doSearch();

    expect(subscription).not.toBeCalled();
  });

  it("should emit search event on modifications if autosearch is enabled", (done) => {
    component.autoSearch = true;

    component.search.subscribe((range) => {
      expect(range).toBeDefined();
      expect(range).toStrictEqual(exampleRange);
      done();
    });

    component.rangeForm.setValue(exampleRange, { emitEvent: true });
    fixture.detectChanges();
  });
});
