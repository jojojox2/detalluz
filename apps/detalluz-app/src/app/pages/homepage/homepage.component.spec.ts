import { ComponentFixture, TestBed } from "@angular/core/testing";
import { PricesService } from "@detalluz/services";
import { NoticeService } from "@detalluz/ui";
import dayjs from "dayjs";
import { of } from "rxjs";
import { HomepageComponent } from "./homepage.component";

describe("HomepageComponent", () => {
  let component: HomepageComponent;
  let fixture: ComponentFixture<HomepageComponent>;
  const mockPricesService = {
    getPrices: jest.fn().mockReturnValue(of(null)),
  };
  const mockNoticeService = {
    showMessage: jest.fn(),
    showSuccessMessage: jest.fn(),
    showWarningMessage: jest.fn(),
    showErrorMessage: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomepageComponent],
      providers: [
        { provide: PricesService, useValue: mockPricesService },
        { provide: NoticeService, useValue: mockNoticeService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should set default date values", () => {
    component.resetRange();

    expect(component.range).toBeDefined();
    expect(component.range.initDate).toBeDefined();
    expect(component.range.endDate).toBeDefined();
  });

  it("should get prices with valid dates", () => {
    mockPricesService.getPrices = jest.fn().mockReturnValue(of(null));
    component.range = {
      initDate: dayjs(),
      endDate: dayjs(),
    };

    component.updateTable();

    expect(mockPricesService.getPrices).toHaveBeenCalled();
  });

  it("should not get prices with invalid dates", () => {
    mockPricesService.getPrices = jest.fn().mockReturnValue(of(null));
    component.range = {
      initDate: dayjs(),
      endDate: undefined,
    };

    component.updateTable();

    expect(mockPricesService.getPrices).not.toHaveBeenCalled();
  });
});
